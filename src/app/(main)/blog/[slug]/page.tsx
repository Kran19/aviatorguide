import { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ClothingBrandsContent } from "@/components/blog/ClothingBrandsContent"
import { TimedRedirectBanner } from "@/components/blog/TimedRedirectBanner"
import { PlayNowBanner } from "@/components/blog/PlayNowBanner"
import { AuthorCard } from "@/components/blog/AuthorCard"
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
  let settings: any = null

  try {
    const [fetchedPost, fetchedSettings] = await Promise.all([
      prisma.post.findUnique({
        where: { slug },
        include: {
          categories: true,
          author: true,
          authorProfile: true,
          faqs: {
            orderBy: { sortOrder: "asc" },
          },
        },
      }),
      prisma.globalSettings.findUnique({
        where: { id: "global" },
      }),
    ])

    post = fetchedPost
    settings = fetchedSettings

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
          authorProfile: true,
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

  const effectiveAuthor = post.authorProfile || post.author || null
  const authorName = effectiveAuthor?.name || "Editorial Team"
  const authorSlug = effectiveAuthor?.slug || (effectiveAuthor?.name ? effectiveAuthor.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : "editorial")
  const authorImage = effectiveAuthor?.image || null
  const authorDesignation = effectiveAuthor?.designation || "Content Creator & Gaming Analyst"
  const authorBio = effectiveAuthor?.bio || null
  const authorSocialLinks = (effectiveAuthor as any)?.socialLinks || null

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
            id: post.id,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            featuredImage: post.featuredImage,
            playImage: post.playImage,
            redirectUrl: post.redirectUrl,
            createdAt: post.createdAt,
            author: { name: authorName, image: authorImage, designation: authorDesignation, bio: authorBio },
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

        <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-muted-foreground border-y border-border/50 py-3">
          <Link
            href={`/author/${authorSlug}`}
            className="flex items-center space-x-2 text-foreground font-semibold hover:text-primary transition-colors group"
          >
            <div className="w-6 h-6 rounded-full overflow-hidden relative bg-muted border border-border shrink-0">
              {authorImage ? (
                <SafeImage
                  src={authorImage}
                  alt={authorName}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-primary/20 flex items-center justify-center text-[10px] text-primary font-bold">
                  {authorName.substring(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            <span className="group-hover:underline">By {authorName}</span>
          </Link>
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
          settings={settings}
        />
      </div>

      {/* Article Content Body (Unmangled HTML) */}
      <main className="max-w-4xl mx-auto prose prose-invert prose-emerald lg:prose-lg leading-relaxed text-foreground/90">
        <div dangerouslySetInnerHTML={{ __html: post.content || "" }} />
      </main>

      {/* Author Profile Bio Card */}
      <div className="max-w-4xl mx-auto my-12">
        <AuthorCard
          name={authorName}
          slug={authorSlug}
          image={authorImage}
          designation={authorDesignation}
          bio={authorBio}
          socialLinks={authorSocialLinks}
        />
      </div>

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
