import { MetadataRoute } from "next"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"
export const revalidate = 3600 // Revalidate sitemap every hour for fresh updates

const BASE_URL = process.env.NEXTAUTH_URL || process.env.AUTH_URL || "https://betsetgo.xyz"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date()

  // Static core routes (Only root homepage is included; /blog, /about, /contact, /privacy, /terms excluded per SEO specification)
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
  ]

  try {
    // Dynamic published blog posts
    const posts = await prisma.post.findMany({
      where: { status: "PUBLISHED", inSitemap: true },
      select: { slug: true, updatedAt: true, createdAt: true },
      orderBy: { updatedAt: "desc" },
    })

    const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: post.updatedAt || post.createdAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }))

    return [...staticRoutes, ...postRoutes]
  } catch (error) {
    console.error("Sitemap generation error:", error)
    return staticRoutes
  }
}