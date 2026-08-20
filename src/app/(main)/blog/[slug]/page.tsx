import { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ClothingBrandsContent } from "@/components/blog/ClothingBrandsContent"
import { TimedRedirectBanner } from "@/components/blog/TimedRedirectBanner"
import { PlayNowBanner } from "@/components/blog/PlayNowBanner"
import { FaqAccordion } from "@/components/blog/FaqAccordion"
import { SafeImage } from "@/components/ui/SafeImage"
import { MetaPixel } from "@/components/analytics/MetaPixel"
import Link from "next/link"
import { Calendar, Clock } from "lucide-react"

export const dynamic = "force-dynamic"

interface BlogPageProps {
  params: Promise<{ slug: string }>
}

function safeJsonLd(data: object): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params
  let post: any = null
  try {
    post = await prisma.post.findUnique({
      where: { slug },
    })
    if (!post) {
      post = await prisma.post.findFirst({
        where: {
          OR: [
            { slug: { startsWith: slug } },
            { slug: { contains: slug } },
          ],
        },
      })
    }
  } catch (err) {
    console.warn("Database unreachable during metadata generation for blog page.", err)
  }

  if (!post) {
    return { title: "Blog Post | betsetgo.xyz" }
  }

  const title = post.metaTitle || post.title
  const description = post.metaDescription || post.excerpt || "Read our latest blog post on betsetgo.xyz."
  const canonicalUrl = `https://betsetgo.xyz/blog/${post.slug}`
  const bannerImage = post.featuredImage || "https://betsetgo.xyz/images/default-blog-banner.svg"

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
      images: [{ url: bannerImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [bannerImage],
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function DynamicBlogPage({ params }: BlogPageProps) {
  const { slug } = await params
  let post: any = null

  try {
    post = await prisma.post.findUnique({
      where: { slug },
      include: {
        categories: true,
        author: true,
        faqs: {
          orderBy: { sortOrder: "asc" },
        },
      },
    })
    if (!post) {
      post = await prisma.post.findFirst({
        where: {
          OR: [
            { slug: { startsWith: slug } },
            { slug: { contains: slug } },
          ],
        },
        include: {
          categories: true,
          author: true,
          faqs: {
            orderBy: { sortOrder: "asc" },
          },
        },
      })
    }
  } catch (err) {
    console.warn("Database unreachable during build time for blog page.", err)
  }

  if (!post) {
    notFound()
  }

  // Canonical post URL
  const canonicalUrl = `https://betsetgo.xyz/blog/${post.slug}`
  const bannerImage = post.featuredImage || "https://betsetgo.xyz/images/default-blog-banner.svg"

  // Special clothing-brands SEO template fallback
  if (post.slug === "clothing-brands") {
    return (
      <>
        <MetaPixel pixelId={(post as any).metaPixelId} />
        <ClothingBrandsContent
          post={{
            ...post,
            author: { name: post.author?.name || null, image: post.author?.image || null, designation: post.author?.designation || null, bio: post.author?.bio || null },
          }}
        />
        <TimedRedirectBanner
          redirectEnabled={post.redirectEnabled}
          redirectUrl={post.redirectUrl}
          redirectDelay={(post as any).redirectDelay}
          postId={post.id}
          slug={post.slug}
        />
      </>
    )
  }

  // 1. Dynamic Article / BlogPosting Schema
  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    headline: post.title,
    description: post.metaDescription || post.excerpt || `Read ${post.title} on betsetgo.xyz`,
    image: [bannerImage],
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt ? post.updatedAt.toISOString() : post.createdAt.toISOString(),
    author: {
      "@type": "Person",
      name: post.author?.name || "Editorial Team",
      ...(post.author?.image ? { image: post.author.image } : {}),
      ...(post.author?.slug ? { url: `https://betsetgo.xyz/author/${post.author.slug}` } : {}),
      ...(post.author?.bio ? { description: post.author.bio } : {}),
    },
    publisher: {
      "@type": "Organization",
      name: "betsetgo.xyz",
      logo: {
        "@type": "ImageObject",
        url: "https://betsetgo.xyz/rocky-logo.png",
      },
    },
  }

  // 2. Dynamic BreadcrumbList Schema (Reflecting current page hierarchy)
  const breadcrumbItems: any[] = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://betsetgo.xyz",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Blog",
      item: "https://betsetgo.xyz/blog",
    },
  ]

  if (post.categories?.[0]) {
    breadcrumbItems.push({
      "@type": "ListItem",
      position: 3,
      name: post.categories[0].name,
      item: `https://betsetgo.xyz/categories/${post.categories[0].slug}`,
    })
    breadcrumbItems.push({
      "@type": "ListItem",
      position: 4,
      name: post.title,
      item: canonicalUrl,
    })
  } else {
    breadcrumbItems.push({
      "@type": "ListItem",
      position: 3,
      name: post.title,
      item: canonicalUrl,
    })
  }

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems,
  }

  // 3. Dynamic FAQPage Schema (ONLY generated if structured FAQs exist)
  const hasFaqs = post.faqs && post.faqs.length > 0
  const jsonLdFaq = hasFaqs
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: post.faqs.map((faq: { question: string; answer: string }) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer.replace(/<[^>]*>?/gm, "").trim(),
          },
        })),
      }
    : null

  return (
    <article className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8 relative">
      <MetaPixel pixelId={(post as any).metaPixelId} />

      {/* Dynamic Structured Data (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLdArticle) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLdBreadcrumb) }}
      />
      {jsonLdFaq && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLdFaq) }}
        />
      )}

      {/* Semantic Breadcrumbs Navigation */}
      <nav aria-label="Breadcrumb" className="max-w-4xl mx-auto mb-8 flex items-center text-xs font-medium text-muted-foreground space-x-2">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/blog" className="hover:text-primary transition-colors">
          Blog
        </Link>
        {post.categories?.[0] && (
          <>
            <span>/</span>
            <Link href={`/categories/${post.categories[0].slug}`} className="hover:text-primary transition-colors">
              {post.categories[0].name}
            </Link>
          </>
        )}
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
      <div className="max-w-4xl mx-auto mb-8 relative h-[350px] sm:h-[450px] rounded-2xl overflow-hidden border border-border/50 shadow-xl bg-muted">
        <SafeImage
          src={post.featuredImage}
          fallbackSrc="/images/default-blog-banner.svg"
          alt={post.featuredImageAlt || post.title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 1000px"
          className="object-cover"
        />
      </div>

      {/* Play Now CTA Callout Banner */}
      <div className="max-w-4xl mx-auto mb-8">
        <PlayNowBanner
          postId={post.id}
          slug={post.slug}
          title={post.title}
          image={post.playImage || post.featuredImage}
          redirectUrl={post.redirectUrl}
        />
      </div>

      {/* Article Content Body (Unmangled HTML) */}
      <main className="max-w-4xl mx-auto prose prose-invert prose-emerald lg:prose-lg leading-relaxed text-foreground/90">
        <div dangerouslySetInnerHTML={{ __html: post.content || "" }} />
      </main>

      {/* CMS-Driven Accessible FAQ Accordion */}
      {hasFaqs && <FaqAccordion faqs={post.faqs} />}

      {/* Timed Client Redirect Toast */}
      <TimedRedirectBanner
        redirectEnabled={post.redirectEnabled}
        redirectUrl={post.redirectUrl}
        redirectDelay={(post as any).redirectDelay}
        postId={post.id}
        slug={post.slug}
      />
    </article>
  )
}
