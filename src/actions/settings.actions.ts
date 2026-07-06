"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"

export async function updateGlobalSettings(data: FormData) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized")

  const siteName = data.get("siteName") as string
  const seoTitle = data.get("seoTitle") as string
  const seoDescription = data.get("seoDescription") as string
  const seoKeywords = data.get("seoKeywords") as string

  if (!siteName) throw new Error("Site Name is required")

  await prisma.globalSettings.upsert({
    where: { id: "global" },
    update: {
      siteName,
      seoTitle,
      seoDescription,
      seoKeywords,
    },
    create: {
      id: "global",
      siteName,
      seoTitle,
      seoDescription,
      seoKeywords,
    }
  })

  revalidatePath("/")
  revalidatePath("/admin/settings")
  return { success: true }
}
