"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"

export async function createPostAction(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const excerpt = formData.get("excerpt") as string
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

  const post = await prisma.post.create({
    data: {
      title,
      slug,
      content,
      excerpt,
      authorId: session.user.id,
      published: false,
    }
  })

  revalidatePath('/admin/posts')
  return { success: true, post }
}
