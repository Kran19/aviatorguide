import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export const revalidate = 3600; // Regenerate every hour

const BASE_URL = "https://betsetgo.xyz";

// Fixed last modified date for static pages
const STATIC_LASTMOD = new Date("2026-07-15T00:00:00.000Z");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: STATIC_LASTMOD,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: STATIC_LASTMOD,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  try {
    const posts = await prisma.post.findMany({
      where: {
        status: "PUBLISHED",
      },
      select: {
        slug: true,
        updatedAt: true,
        createdAt: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    const dynamicRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: post.updatedAt ?? post.createdAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    return [...staticRoutes, ...dynamicRoutes];
  } catch (error) {
    console.error("Sitemap generation failed:", error);

    // Always return static sitemap if DB is unavailable
    return staticRoutes;
  }
}