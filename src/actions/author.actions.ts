"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export async function getAuthors() {
  try {
    const authors = await prisma.author.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    })
    return { success: true, data: authors }
  } catch (error: any) {
    console.error("Failed to fetch authors:", error)
    return { success: false, error: error.message || "Failed to load authors" }
  }
}

export async function getAuthorBySlug(slug: string) {
  try {
    const author = await prisma.author.findUnique({
      where: { slug },
      include: {
        posts: {
          where: { status: "PUBLISHED" },
          orderBy: { createdAt: "desc" },
          include: {
            categories: true,
            authorProfile: true,
          },
        },
        _count: {
          select: {
            posts: {
              where: { status: "PUBLISHED" },
            },
          },
        },
      },
    })

    if (!author) {
      return { success: false, error: "Author not found" }
    }

    return { success: true, data: author }
  } catch (error: any) {
    console.error("Failed to fetch author by slug:", error)
    return { success: false, error: error.message || "Failed to load author" }
  }
}

export async function createAuthor(formData: FormData) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    return { success: false, error: "Unauthorized: Only Admin can create author profiles" }
  }

  const name = (formData.get("name") as string)?.trim()
  let slug = (formData.get("slug") as string)?.trim()
  const designation = (formData.get("designation") as string)?.trim() || "Gaming Journalist & Analyst"
  const bio = (formData.get("bio") as string)?.trim() || ""
  const image = (formData.get("image") as string)?.trim() || null
  const coverImage = (formData.get("coverImage") as string)?.trim() || null
  const expertiseRaw = (formData.get("expertise") as string)?.trim() || ""
  const twitter = (formData.get("twitter") as string)?.trim() || ""
  const linkedin = (formData.get("linkedin") as string)?.trim() || ""
  const github = (formData.get("github") as string)?.trim() || ""
  const website = (formData.get("website") as string)?.trim() || ""
  const instagram = (formData.get("instagram") as string)?.trim() || ""
  const youtube = (formData.get("youtube") as string)?.trim() || ""

  if (!name) {
    return { success: false, error: "Author name is required" }
  }

  if (!slug) {
    slug = slugify(name)
  } else {
    slug = slugify(slug)
  }

  // Check unique slug
  const existing = await prisma.author.findUnique({
    where: { slug },
  })

  if (existing) {
    slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`
  }

  const expertise = expertiseRaw
    ? expertiseRaw.split(",").map((e) => e.trim()).filter(Boolean)
    : []

  const socialLinks: Record<string, string> = {}
  if (twitter) socialLinks.twitter = twitter
  if (linkedin) socialLinks.linkedin = linkedin
  if (github) socialLinks.github = github
  if (website) socialLinks.website = website
  if (instagram) socialLinks.instagram = instagram
  if (youtube) socialLinks.youtube = youtube

  try {
    const author = await prisma.author.create({
      data: {
        name,
        slug,
        designation,
        bio,
        image,
        coverImage,
        expertise,
        socialLinks: Object.keys(socialLinks).length > 0 ? socialLinks : undefined,
      },
    })

    revalidatePath("/admin/authors")
    revalidatePath("/admin/posts")
    revalidatePath(`/author/${author.slug}`)
    return { success: true, data: author }
  } catch (error: any) {
    console.error("Failed to create author:", error)
    return { success: false, error: error.message || "Failed to create author" }
  }
}

export async function updateAuthor(id: string, formData: FormData) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    return { success: false, error: "Unauthorized: Only Admin can update author profiles" }
  }

  const name = (formData.get("name") as string)?.trim()
  let slug = (formData.get("slug") as string)?.trim()
  const designation = (formData.get("designation") as string)?.trim() || "Gaming Journalist & Analyst"
  const bio = (formData.get("bio") as string)?.trim() || ""
  const image = (formData.get("image") as string)?.trim() || null
  const coverImage = (formData.get("coverImage") as string)?.trim() || null
  const expertiseRaw = (formData.get("expertise") as string)?.trim() || ""
  const twitter = (formData.get("twitter") as string)?.trim() || ""
  const linkedin = (formData.get("linkedin") as string)?.trim() || ""
  const github = (formData.get("github") as string)?.trim() || ""
  const website = (formData.get("website") as string)?.trim() || ""
  const instagram = (formData.get("instagram") as string)?.trim() || ""
  const youtube = (formData.get("youtube") as string)?.trim() || ""

  if (!name) {
    return { success: false, error: "Author name is required" }
  }

  if (!slug) {
    slug = slugify(name)
  } else {
    slug = slugify(slug)
  }

  // Check if slug taken by another author
  const existing = await prisma.author.findFirst({
    where: {
      slug,
      NOT: { id },
    },
  })

  if (existing) {
    return { success: false, error: `Slug "${slug}" is already used by another author.` }
  }

  const expertise = expertiseRaw
    ? expertiseRaw.split(",").map((e) => e.trim()).filter(Boolean)
    : []

  const socialLinks: Record<string, string> = {}
  if (twitter) socialLinks.twitter = twitter
  if (linkedin) socialLinks.linkedin = linkedin
  if (github) socialLinks.github = github
  if (website) socialLinks.website = website
  if (instagram) socialLinks.instagram = instagram
  if (youtube) socialLinks.youtube = youtube

  try {
    const author = await prisma.author.update({
      where: { id },
      data: {
        name,
        slug,
        designation,
        bio,
        image,
        coverImage,
        expertise,
        socialLinks: Object.keys(socialLinks).length > 0 ? socialLinks : undefined,
      },
    })

    revalidatePath("/admin/authors")
    revalidatePath("/admin/posts")
    revalidatePath(`/author/${author.slug}`)
    revalidatePath("/blog")
    return { success: true, data: author }
  } catch (error: any) {
    console.error("Failed to update author:", error)
    return { success: false, error: error.message || "Failed to update author" }
  }
}

export async function deleteAuthor(id: string) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    return { success: false, error: "Unauthorized: Only Admin can delete author profiles" }
  }

  try {
    // Unlink from posts before deleting
    await prisma.post.updateMany({
      where: { authorProfileId: id },
      data: { authorProfileId: null },
    })

    await prisma.author.delete({
      where: { id },
    })

    revalidatePath("/admin/authors")
    revalidatePath("/admin/posts")
    return { success: true }
  } catch (error: any) {
    console.error("Failed to delete author:", error)
    return { success: false, error: error.message || "Failed to delete author" }
  }
}
