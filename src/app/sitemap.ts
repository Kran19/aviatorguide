import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export const revalidate = 86400; // Cache sitemap for 1 day
const BASE_URL = "https://betsetgo.xyz";
const STATIC_LASTMOD = new Date("2026-07-15T00:00:00.000Z");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: STATIC_LASTMOD,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: STATIC_LASTMOD,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/categories`,
      lastModified: STATIC_LASTMOD,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: STATIC_LASTMOD,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: STATIC_LASTMOD,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: STATIC_LASTMOD,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: STATIC_LASTMOD,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  try {
    const posts = await prisma.post.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true, createdAt: true },
    });

    const categories = await prisma.category.findMany({
      select: { slug: true },
    });

    const authors = await prisma.user.findMany({
      where: {
        posts: { some: { status: "PUBLISHED" } }
      },
      select: { slug: true, name: true },
    });

    const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: post.updatedAt ?? post.createdAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
      url: `${BASE_URL}/categories/${cat.slug}`,
      lastModified: STATIC_LASTMOD,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    const authorRoutes: MetadataRoute.Sitemap = authors.map((author) => {
      const slug = author.slug || (author.name ? author.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'rocky11-club')
      return {
        url: `${BASE_URL}/author/${slug}`,
        lastModified: STATIC_LASTMOD,
        changeFrequency: "weekly",
        priority: 0.7,
      }
    });

    // Default rocky11 author fallback if not in database query
    if (!authorRoutes.some(r => r.url.includes('rocky11-club'))) {
      authorRoutes.push({
        url: `${BASE_URL}/author/rocky11-club`,
        lastModified: STATIC_LASTMOD,
        changeFrequency: "weekly",
        priority: 0.7,
      })
    }

    return [...staticRoutes, ...postRoutes, ...categoryRoutes, ...authorRoutes];
  } catch (error) {
    console.error("Sitemap Error:", error);
    return staticRoutes;
  }
}