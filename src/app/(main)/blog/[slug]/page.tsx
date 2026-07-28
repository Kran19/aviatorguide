import React from 'react'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, Calendar, ChevronRight } from 'lucide-react'
import { SafeImage } from '@/components/ui/SafeImage'
import { AuthorCard } from '@/components/blog/AuthorCard'

export const revalidate = 60 // ISR

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  let post = null
  try {
    post = await prisma.post.findUnique({
      where: { slug: resolvedParams.slug },
      include: { author: true },
    })
  } catch (e) {}

  if (!post) return { title: 'Post Not Found' }

  const title = post.metaTitle || `${post.title} - betsetgo.xyz`
  const description = post.metaDescription || post.excerpt || post.title
  const url = `https://betsetgo.xyz/blog/${post.slug}`
  const authorName = post.author?.name || 'rocky11.club'

  return {
    title,
    description,
    keywords: post.focusKeyword ? [post.focusKeyword] : [],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      publishedTime: post.createdAt.toISOString(),
      modifiedTime: post.updatedAt ? post.updatedAt.toISOString() : post.createdAt.toISOString(),
      authors: [authorName],
      images: post.featuredImage ? [{ url: post.featuredImage }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.featuredImage ? [post.featuredImage] : [],
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  let post: any = null
  try {
    post = await prisma.post.findUnique({
      where: { slug: resolvedParams.slug, status: 'PUBLISHED' },
      include: {
        categories: true,
        author: true,
      },
    })
  } catch (e) {
    console.warn("Database unreachable during build time for blog post.", e)
  }

  if (!post) {
    notFound()
  }

  const authorObj = post.author || {
    name: "rocky11.club",
    slug: "rocky11-club",
    image: "/rocky-logo.png",
    designation: "Official Author",
    bio: "BetSetGo content team combines years of expertise in online gaming, sports analysis, and platform mechanics to bring you accurate guides, game reviews, and responsible gaming information."
  }

  const authorName = authorObj.name || "rocky11.club"
  const authorSlug = authorObj.slug || authorName.toLowerCase().replace(/[^a-z0-9]+/g, '-')

  // Reading time estimation
  const wordCount = post.content ? post.content.replace(/<[^>]*>?/gm, '').split(/\s+/).length : 0
  const readingMinutes = Math.max(1, Math.ceil(wordCount / 220))
  const readingTimeText = `${readingMinutes} min read`

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || post.metaDescription || post.title,
    image: post.featuredImage ? [post.featuredImage] : [],
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt ? post.updatedAt.toISOString() : post.createdAt.toISOString(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://betsetgo.xyz/blog/${post.slug}`
    },
    author: [{
      "@type": "Person",
      "name": authorName,
      "url": `https://betsetgo.xyz/author/${authorSlug}`
    }],
    publisher: {
      "@type": "Organization",
      "name": "betsetgo.xyz",
      "logo": {
        "@type": "ImageObject",
        "url": "https://betsetgo.xyz/rocky-logo.png"
      }
    }
  }

  const firstCategory = post.categories?.[0]

  return (
    <div className="min-h-screen bg-background relative overflow-hidden pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* 3D ambient backgrounds */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] rounded-full -z-10" />
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-blue-500/10 blur-[100px] rounded-full -z-10" />

      <div className="container mx-auto max-w-5xl px-3 sm:px-6 lg:px-8 pt-4 pb-12">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-xs font-semibold text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
          {firstCategory && (
            <>
              <ChevronRight className="w-3 h-3" />
              <Link href={`/categories/${firstCategory.slug}`} className="hover:text-foreground transition-colors">
                {firstCategory.name}
              </Link>
            </>
          )}
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground truncate max-w-[200px] sm:max-w-xs">{post.title}</span>
        </nav>

        <article className="glass-card p-4 sm:p-8 md:p-12 rounded-3xl border border-white/10 dark:border-white/5 shadow-2xl relative overflow-hidden backdrop-blur-xl bg-background/60">

          {/* Game Widget (if present) */}
          {post.playImage && (
            <div className="flex flex-col items-center justify-center mb-10 max-w-sm mx-auto">
              <div className="w-full aspect-square rounded-2xl overflow-hidden mb-4 bg-muted relative shadow-lg">
                <SafeImage
                  src={post.playImage}
                  alt={post.playImageAlt || post.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex w-full gap-3">
                <a
                  href="https://rocky11.club/?refercode=SEO"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-[#00D09C] hover:bg-[#00D09C]/90 text-black font-extrabold py-3 rounded-xl text-center transition-colors shadow-lg text-sm sm:text-base"
                >
                  Play Now
                </a>
              </div>
            </div>
          )}

          {/* Article Banner Header */}
          <header className="mb-8 text-center max-w-4xl mx-auto">
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {post.categories.map((cat: any) => (
                <Link key={cat.id} href={`/categories/${cat.slug}`}>
                  <span className="text-xs font-bold text-primary-foreground bg-primary px-3 py-1 rounded-full uppercase tracking-wider shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>

            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent break-words leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm text-muted-foreground font-semibold">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-primary" />
                <time dateTime={post.createdAt.toISOString()}>
                  {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </time>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-400" />
                <span>{readingTimeText}</span>
              </span>
              <span>•</span>
              <Link href={`/author/${authorSlug}`} className="text-primary hover:underline font-bold">
                By {authorName}
              </Link>
            </div>
          </header>

          {/* Featured Image Responsive Banner */}
          {post.featuredImage && (
            <div className="w-full max-w-4xl mx-auto h-52 xs:h-64 sm:h-80 md:h-[450px] lg:h-[500px] overflow-hidden rounded-2xl mb-12 bg-muted relative group shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <SafeImage
                src={post.featuredImage}
                alt={post.featuredImageAlt || post.title}
                fallbackText={post.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                className="object-contain sm:object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          )}

          {/* Article HTML Content with image center alignment styles */}
          <div
            className="prose prose-sm sm:prose-base md:prose-lg dark:prose-invert max-w-none prose-p:leading-relaxed prose-p:my-3 prose-headings:font-bold prose-headings:my-4 prose-li:my-1 prose-ul:my-2 prose-ol:my-2 prose-a:text-blue-500 hover:prose-a:text-blue-600 dark:prose-a:text-blue-400 dark:hover:prose-a:text-blue-300 prose-img:rounded-xl prose-img:shadow-xl"
            dangerouslySetInnerHTML={{ 
              __html: post.content.replace(/<(h[1-6])([^>]*)>(.*?)<\/\1>/gi, '<$1$2><strong>$3</strong></$1>') 
            }}
          />

          {/* Reusable Author Profile Card */}
          <div className="mt-16 pt-8 border-t border-border/50">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">
              Written By
            </h3>
            <AuthorCard
              name={authorName}
              slug={authorSlug}
              image={authorObj.image}
              designation={authorObj.designation || "Official Author"}
              bio={authorObj.bio}
              socialLinks={authorObj.socialLinks}
              lastUpdated={post.updatedAt || post.createdAt}
              readingTime={readingTimeText}
            />
          </div>
        </article>
      </div>
    </div>
  )
}
