"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createPost(formData: FormData) {
  const session = await auth()
  
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized")
  }

  const title = formData.get("title") as string
  const slug = formData.get("slug") as string
  const excerpt = formData.get("excerpt") as string
  const content = formData.get("content") as string
  const featuredImage = formData.get("featuredImage") as string
  const published = formData.get("published") === "on"

  if (!title || !slug || !content) {
    throw new Error("Missing required fields")
  }

  await prisma.post.create({
    data: {
      title,
      slug,
      excerpt,
      content,
      featuredImage: featuredImage || null,
      published,
      authorId: session.user.id,
    },
  })

  revalidatePath("/admin/posts")
  revalidatePath("/")
  redirect("/admin/posts")
}

export async function updatePost(id: string, formData: FormData) {
  const session = await auth()
  
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized")
  }

  const title = formData.get("title") as string
  const slug = formData.get("slug") as string
  const excerpt = formData.get("excerpt") as string
  const content = formData.get("content") as string
  const featuredImage = formData.get("featuredImage") as string
  const published = formData.get("published") === "on"

  if (!title || !slug || !content) {
    throw new Error("Missing required fields")
  }

  await prisma.post.update({
    where: { id },
    data: {
      title,
      slug,
      excerpt,
      content,
      featuredImage: featuredImage || null,
      published,
    },
  })

  revalidatePath("/admin/posts")
  revalidatePath("/")
  redirect("/admin/posts")
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
