"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"

export async function createCategory(data: FormData) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN" && !session?.user?.permissions?.includes("CAN_MANAGE_CATEGORIES")) {
    throw new Error("Unauthorized")
  }

  const name = data.get("name") as string
  const slug = data.get("slug") as string
  const description = data.get("description") as string

  if (!name || !slug) throw new Error("Missing required fields")

  const existing = await prisma.category.findUnique({ where: { slug } })
  if (existing) throw new Error("Category with that slug already exists")

  await prisma.category.create({
    data: {
      name,
      slug,
      description,
    }
  })

  revalidatePath("/admin/categories")
  return { success: true }
}

export async function deleteCategory(id: string) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN" && !session?.user?.permissions?.includes("CAN_MANAGE_CATEGORIES")) {
    throw new Error("Unauthorized")
  }

  await prisma.category.delete({ where: { id } })
  revalidatePath("/admin/categories")
  return { success: true }
}
