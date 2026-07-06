"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import bcrypt from "bcryptjs"

export async function updateProfile(data: FormData) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const name = data.get("name") as string
  const password = data.get("password") as string

  const updateData: any = {}
  
  if (name) {
    updateData.name = name
  }
  
  if (password && password.length >= 6) {
    updateData.passwordHash = await bcrypt.hash(password, 10)
  }

  if (Object.keys(updateData).length > 0) {
    await prisma.user.update({
      where: { id: session.user.id },
      data: updateData
    })
  }

  revalidatePath("/admin/profile")
  return { success: true }
}
