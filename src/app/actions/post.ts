"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createPost(formData: FormData) {
  const session = await auth()
  
  if (!session?.user?.id || (session.user.role !== "ADMIN" && session.user.role !== "AUTHOR")) {
    return { success: false, error: "Unauthorized" }
  }

  const title = formData.get("title") as string
  const slug = formData.get("slug") as string
  const excerpt = formData.get("excerpt") as string
  const content = formData.get("content") as string
  const featuredImage = formData.get("featuredImage") as string
  const featuredImageAlt = formData.get("featuredImageAlt") as string
  const playImage = formData.get("playImage") as string
  const playImageAlt = formData.get("playImageAlt") as string
  const metaTitle = formData.get("metaTitle") as string
  const metaDescription = formData.get("metaDescription") as string
  const focusKeyword = formData.get("focusKeyword") as string
  const categoryId = formData.get("categoryId") as string
  const tagsStr = formData.get("tags") as string
  
  const tagNames = tagsStr 
    ? tagsStr.split(",").map(t => t.trim()).filter(Boolean) 
    : []
  
  // Handle status/approval logic
  let status = "DRAFT"
  if (session.user.role === "ADMIN") {
    status = formData.get("status") as string || "DRAFT"
  } else {
    // Authors can only submit drafts or pending
    status = formData.get("submitForApproval") === "true" ? "PENDING_APPROVAL" : "DRAFT"
  }

  if (!title || !slug || !content) {
    return { success: false, error: "Missing required fields" }
  }

  await prisma.post.create({
    data: {
      title,
      slug,
      excerpt,
      content,
      featuredImage: featuredImage || null,
      featuredImageAlt: featuredImageAlt || null,
      playImage: playImage || null,
      playImageAlt: playImageAlt || null,
      status: status as any,
      metaTitle: metaTitle || null,
      metaDescription: metaDescription || null,
      focusKeyword: focusKeyword || null,
      authorId: session.user.id,
      categories: categoryId ? {
        connectOrCreate: [{
          where: { slug: categoryId.toLowerCase().replace(/[^a-z0-9]+/g, '-') },
          create: { name: categoryId, slug: categoryId.toLowerCase().replace(/[^a-z0-9]+/g, '-') }
        }]
      } : undefined,
      tags: {
        connectOrCreate: tagNames.map(name => ({
          where: { slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-') },
          create: { name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-') }
        }))
      }
    },
  })

  revalidatePath("/admin/posts")
  revalidatePath("/")
  return { success: true }
}

export async function updatePost(id: string, formData: FormData) {
  const session = await auth()
  
  if (!session?.user?.id || (session.user.role !== "ADMIN" && session.user.role !== "AUTHOR")) {
    return { success: false, error: "Unauthorized" }
  }

  if (session.user.role === "AUTHOR") {
    const existingPost = await prisma.post.findUnique({ where: { id } })
    if (existingPost?.authorId !== session.user.id) {
      return { success: false, error: "Unauthorized: You can only edit your own posts." }
    }
  }

  const title = formData.get("title") as string
  const slug = formData.get("slug") as string
  const excerpt = formData.get("excerpt") as string
  const content = formData.get("content") as string
  const featuredImage = formData.get("featuredImage") as string
  const featuredImageAlt = formData.get("featuredImageAlt") as string
  const playImage = formData.get("playImage") as string
  const playImageAlt = formData.get("playImageAlt") as string
  const metaTitle = formData.get("metaTitle") as string
  const metaDescription = formData.get("metaDescription") as string
  const focusKeyword = formData.get("focusKeyword") as string
  const adminRemarks = formData.get("adminRemarks") as string
  const categoryId = formData.get("categoryId") as string
  const tagsStr = formData.get("tags") as string
  
  const tagNames = tagsStr 
    ? tagsStr.split(",").map(t => t.trim()).filter(Boolean) 
    : []

  // Handle status/approval logic
  let status = "DRAFT"
  let dataToUpdate: any = {
    title,
    slug,
    excerpt,
    content,
    featuredImage: featuredImage || null,
    featuredImageAlt: featuredImageAlt || null,
    playImage: playImage || null,
    playImageAlt: playImageAlt || null,
    metaTitle: metaTitle || null,
    metaDescription: metaDescription || null,
    focusKeyword: focusKeyword || null,
    categories: categoryId ? {
      set: [],
      connectOrCreate: [{
        where: { slug: categoryId.toLowerCase().replace(/[^a-z0-9]+/g, '-') },
        create: { name: categoryId, slug: categoryId.toLowerCase().replace(/[^a-z0-9]+/g, '-') }
      }]
    } : { set: [] },
    tags: {
      set: [], // Clear existing connections
      connectOrCreate: tagNames.map(name => ({
        where: { slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-') },
        create: { name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-') }
      }))
    }
  }

  if (session.user.role === "ADMIN") {
    status = formData.get("status") as string || "DRAFT"
    dataToUpdate.status = status as any
    if (adminRemarks !== undefined) {
      dataToUpdate.adminRemarks = adminRemarks
    }
  } else {
    // Authors can only submit drafts or pending, and can't edit adminRemarks
    status = formData.get("submitForApproval") === "true" ? "PENDING_APPROVAL" : "DRAFT"
    dataToUpdate.status = status as any
  }

  if (!title || !slug || !content) {
    return { success: false, error: "Missing required fields" }
  }

  await prisma.post.update({
    where: { id },
    data: dataToUpdate,
  })

  revalidatePath("/admin/posts")
  revalidatePath("/")
  return { success: true }
}

export async function deletePost(id: string) {
  const session = await auth()
  
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized")
  }

  await prisma.post.delete({
    where: { id },
  })

  revalidatePath("/admin/posts")
  revalidatePath("/")
}

export async function quickApprovePost(id: string) {
  const session = await auth()
  
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized")
  }

  await prisma.post.update({
    where: { id },
    data: { status: "PUBLISHED" }
  })

  revalidatePath("/admin/posts")
  revalidatePath("/")
}

export async function rejectPost(id: string) {
  const session = await auth()
  
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized")
  }

  await prisma.post.update({
    where: { id },
    data: { status: "REJECTED" }
  })

  revalidatePath("/admin/posts")
  revalidatePath("/")
}
