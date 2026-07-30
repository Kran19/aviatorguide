import { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ClothingBrandsContent } from "@/components/blog/ClothingBrandsContent"

interface BlogPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await prisma.post.findUnique({
    where: { slug },
  })

  if (!post) {
    return { title: "Blog Post Not Found" }
  }

  const title = post.metaTitle || post.title
  const description = post.metaDescription || post.excerpt || "Read our latest blog post on NextBlog."
  const canonicalUrl = `https://nextblog.xyz/blog/${post.slug}`

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "article",
      images: post.featuredImage ? [{ url: post.featuredImage }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.featuredImage ? [post.featuredImage] : [],
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function DynamicBlogPage({ params }: BlogPageProps) {
  const { slug } = await params

  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      author: {
        select: {
          name: true,
          image: true,
          designation: true,
          bio: true,
        },
      },
    },
  })

  if (!post) {
    notFound()
  }

  // JSON-LD Structured Data
  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || post.metaDescription,
    image: post.featuredImage,
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      "@type": "Person",
      name: post.author.name || "Editorial Team",
    },
    publisher: {
      "@type": "Organization",
      name: "NextBlog",
      logo: {
        "@type": "ImageObject",
        url: "https://nextblog.xyz/icon.png",
      },
    },
  }

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://nextblog.xyz",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://nextblog.xyz/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `https://nextblog.xyz/blog/${post.slug}`,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />

      <ClothingBrandsContent post={post} />
    </>
  )
}
