"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"

function isAllowedUrl(url: string): boolean {
  if (!url || typeof url !== "string") return false
  const trimmed = url.trim()
  if (!trimmed) return false

  const lower = trimmed.toLowerCase()
  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("data:") ||
    lower.startsWith("vbscript:")
  ) {
    return false
  }

  if (
    lower.startsWith("https://") ||
    lower.startsWith("http://") ||
    lower.startsWith("/") ||
    lower.startsWith("#") ||
    lower.startsWith("mailto:") ||
    lower.startsWith("tel:")
  ) {
    return true
  }

  return false
}

export async function updateGlobalSettings(data: FormData) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized")

  const siteName = (data.get("siteName") as string) || "betsetgo.xyz"
  const seoTitle = (data.get("seoTitle") as string) || ""
  const seoDescription = (data.get("seoDescription") as string) || ""
  const seoKeywords = (data.get("seoKeywords") as string) || ""

  if (!siteName) throw new Error("Site Name is required")

  // Featured Gaming Portal CMS fields
  const featuredPortalEnabled = data.get("featuredPortalEnabled") === "true" || data.get("featuredPortalEnabled") === "on"
  const featuredPortalHeading = (data.get("featuredPortalHeading") as string) || "Featured Gaming Portal"
  const featuredPortalTitle = (data.get("featuredPortalTitle") as string) || "Ready to Play & Win Rewards?"
  const featuredPortalDescription = (data.get("featuredPortalDescription") as string) || "Experience fast multiplier rounds, instant cashouts, and official certified fair play."
  const featuredPortalCtaText = (data.get("featuredPortalCtaText") as string) || "PLAY NOW"
  let featuredPortalCtaUrl = (data.get("featuredPortalCtaUrl") as string) || "https://rocky11.club/?refercode=SEO"
  const featuredPortalBadge1 = (data.get("featuredPortalBadge1") as string) || "Provably Fair"
  const featuredPortalBadge2 = (data.get("featuredPortalBadge2") as string) || "Instant Cashouts"
  const featuredPortalRelFollow = data.get("featuredPortalRelFollow") === "true"

  if (featuredPortalCtaUrl && !isAllowedUrl(featuredPortalCtaUrl)) {
    throw new Error("Invalid or unsafe CTA destination URL.")
  }

  await prisma.globalSettings.upsert({
    where: { id: "global" },
    update: {
      siteName,
      seoTitle,
      seoDescription,
      seoKeywords,
      featuredPortalEnabled,
      featuredPortalHeading,
      featuredPortalTitle,
      featuredPortalDescription,
      featuredPortalCtaText,
      featuredPortalCtaUrl,
      featuredPortalBadge1,
      featuredPortalBadge2,
      featuredPortalRelFollow,
    },
    create: {
      id: "global",
      siteName,
      seoTitle,
      seoDescription,
      seoKeywords,
      featuredPortalEnabled,
      featuredPortalHeading,
      featuredPortalTitle,
      featuredPortalDescription,
      featuredPortalCtaText,
      featuredPortalCtaUrl,
      featuredPortalBadge1,
      featuredPortalBadge2,
      featuredPortalRelFollow,
    }
  })

  revalidatePath("/")
  revalidatePath("/blog")
  revalidatePath("/admin/settings")
  return { success: true }
}
