"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

function parseFaqsFromFormData(formData: FormData): { question: string; answer: string; sortOrder: number }[] {
  const faqsRaw = formData.get("faqs") as string
  if (!faqsRaw) return []

  try {
    const arr = JSON.parse(faqsRaw)
    if (!Array.isArray(arr)) return []

    return arr
      .map((item: any, index: number) => ({
        question: typeof item.question === "string" ? item.question.trim() : "",
        answer: typeof item.answer === "string" ? item.answer.trim() : "",
        sortOrder: typeof item.sortOrder === "number" ? item.sortOrder : index,
      }))
      .filter((item) => item.question.length > 0 && item.answer.length > 0)
  } catch (err) {
    console.error("Failed to parse faqs:", err)
    return []
  }
}

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
  const inSitemap = formData.get("inSitemap") === "on"
  const parsedFaqs = parseFaqsFromFormData(formData)
  
  const tagNames = tagsStr 
    ? tagsStr.split(",").map(t => t.trim()).filter(Boolean) 
    : []
  
  // Handle status/approval logic
  let status = "DRAFT"
  if (session.user.role === "ADMIN" || session.user.permissions?.includes("CAN_PUBLISH_POSTS")) {
    status = formData.get("status") as string || "DRAFT"
  } else {
    // Standard authors can only submit drafts or pending
    status = formData.get("submitForApproval") === "true" ? "PENDING_APPROVAL" : "DRAFT"
  }

  if (!title || !slug || !content) {
    return { success: false, error: "Missing required fields" }
  }

  try {
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
        inSitemap,
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
        },
        faqs: parsedFaqs.length > 0 ? {
          create: parsedFaqs
        } : undefined,
      },
    })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, error: "A post with this URL slug already exists. Please choose a different one." }
    }
    console.error("Failed to create post:", error)
    return { success: false, error: "An unexpected error occurred while creating the post." }
  }

  revalidatePath("/admin/posts")
  revalidatePath("/")
  revalidatePath("/blog")
  revalidatePath(`/blog/${slug}`)
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
  const inSitemap = formData.get("inSitemap") === "on"
  const parsedFaqs = parseFaqsFromFormData(formData)
  
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
    inSitemap,
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
    },
    faqs: {
      deleteMany: {},
      create: parsedFaqs,
    },
  }

  if (session.user.role === "ADMIN" || session.user.permissions?.includes("CAN_PUBLISH_POSTS")) {
    status = formData.get("status") as string || "DRAFT"
    dataToUpdate.status = status as any
    if (session.user.role === "ADMIN" && adminRemarks !== undefined) {
      dataToUpdate.adminRemarks = adminRemarks
    }
  } else {
    // Standard authors can only submit drafts or pending, and can't edit adminRemarks
    status = formData.get("submitForApproval") === "true" ? "PENDING_APPROVAL" : "DRAFT"
    dataToUpdate.status = status as any
  }

  if (!title || !slug || !content) {
    return { success: false, error: "Missing required fields" }
  }

  try {
    await prisma.post.update({
      where: { id },
      data: dataToUpdate,
    })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, error: "A post with this URL slug already exists. Please choose a different one." }
    }
    console.error("Failed to update post:", error)
    return { success: false, error: "An unexpected error occurred while updating the post." }
  }

  revalidatePath("/admin/posts")
  revalidatePath("/")
  revalidatePath("/blog")
  revalidatePath(`/blog/${slug}`)
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
