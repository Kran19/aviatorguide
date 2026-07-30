import { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ClothingBrandsContent } from "@/components/blog/ClothingBrandsContent"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, Sparkles } from "lucide-react"

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
  const description = post.metaDescription || post.excerpt || "Read our latest blog post on betsetgo.xyz."
  const canonicalUrl = `https://betsetgo.xyz/blog/${post.slug}`

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
      categories: true,
    },
  })

  if (!post) {
    notFound()
  }

  // If special clothing-brands SEO template
  if (post.slug === "clothing-brands") {
    return (
      <ClothingBrandsContent
        post={{
          ...post,
          author: { name: null, image: null, designation: null, bio: null },
        }}
      />
    )
  }

  // JSON-LD Article Schema without Author entity
  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || post.metaDescription,
    image: post.featuredImage,
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    publisher: {
      "@type": "Organization",
      name: "betsetgo.xyz",
      logo: {
        "@type": "ImageObject",
        url: "https://betsetgo.xyz/rocky-logo.png",
      },
    },
  }

  return (
    <article className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />

      {/* Breadcrumbs */}
      <nav className="max-w-4xl mx-auto mb-8 flex items-center text-xs font-medium text-muted-foreground space-x-2">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/blog" className="hover:text-primary transition-colors">
          Blog
        </Link>
        <span>/</span>
        <span className="text-foreground truncate">{post.title}</span>
      </nav>

      {/* Article Header */}
      <header className="max-w-4xl mx-auto mb-10">
        {post.categories?.[0] && (
          <span className="inline-block px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase rounded-full mb-4">
            {post.categories[0].name}
          </span>
        )}

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center space-x-6 text-xs text-muted-foreground border-y border-border/50 py-3">
          <span className="flex items-center space-x-1.5">
            <Calendar className="w-4 h-4 text-primary" />
            <span>{new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <Clock className="w-4 h-4 text-primary" />
            <span>5 Min Read</span>
          </span>
        </div>
      </header>

      {/* Featured Banner */}
      {post.featuredImage && (
        <div className="max-w-4xl mx-auto mb-12 relative h-[350px] sm:h-[450px] rounded-2xl overflow-hidden border border-border/50 shadow-xl">
          <Image src={post.featuredImage} alt={post.title} fill priority className="object-cover" />
        </div>
      )}

      {/* Article Content Body */}
      <main className="max-w-4xl mx-auto prose prose-invert prose-emerald lg:prose-lg leading-relaxed text-foreground/90 space-y-6">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </main>
    </article>
  )
}
