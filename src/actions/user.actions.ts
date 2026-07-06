"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import bcrypt from "bcryptjs"
import { Role } from "@prisma/client"

export async function createUser(data: FormData) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized")

  const name = data.get("name") as string
  const email = data.get("email") as string
  const password = data.get("password") as string
  const role = data.get("role") as Role

  if (!email || !password || !name) throw new Error("Missing fields")

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) throw new Error("User with that email already exists")

  const hashedPassword = await bcrypt.hash(password, 10)

  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: hashedPassword,
      role: role || "AUTHOR",
    }
  })

  revalidatePath("/admin/users")
  return { success: true }
}

export async function deleteUser(id: string) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized")
  
  if (session.user.id === id) throw new Error("Cannot delete yourself")

  await prisma.user.delete({ where: { id } })
  revalidatePath("/admin/users")
  return { success: true }
}
