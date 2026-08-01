import { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ClothingBrandsContent } from "@/components/blog/ClothingBrandsContent"
import { TimedRedirectBanner } from "@/components/blog/TimedRedirectBanner"
import { PlayNowBanner } from "@/components/blog/PlayNowBanner"
import { SafeImage } from "@/components/ui/SafeImage"
import { MetaPixel } from "@/components/analytics/MetaPixel"
import Link from "next/link"
import { Calendar, Clock } from "lucide-react"

export const dynamic = "force-dynamic"

interface BlogPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params
  let post: any = null
  try {
    post = await prisma.post.findUnique({
      where: { slug },
    })
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
      },
    })
  } catch (err) {
    console.warn("Database unreachable during build time for blog page.", err)
  }

  if (!post) {
    notFound()
  }

  // If special clothing-brands SEO template
  if (post.slug === "clothing-brands") {
    return (
      <>
        <MetaPixel pixelId={(post as any).metaPixelId} />
        <ClothingBrandsContent
          post={{
            ...post,
            author: { name: null, image: null, designation: null, bio: null },
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

  // JSON-LD Article Schema
  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || post.metaDescription,
    image: post.featuredImage || "https://betsetgo.xyz/images/default-blog-banner.svg",
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

  // JSON-LD Breadcrumb Schema
  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
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
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `https://betsetgo.xyz/blog/${post.slug}`,
      },
    ],
  }

  // Dynamic FAQ Extraction from HTML Content for Google Rich Snippets
  const extractedFaqs: { question: string; answer: string }[] = []
  if (post.content) {
    const faqRegex = /<h3[^>]*>([\s\S]*?\?[\s\S]*?)<\/h3>\s*<p[^>]*>([\s\S]*?)<\/p>/gi
    let match
    while ((match = faqRegex.exec(post.content)) !== null) {
      const question = match[1].replace(/<[^>]*>?/gm, "").trim()
      const answer = match[2].replace(/<[^>]*>?/gm, "").trim()
      if (question && answer) {
        extractedFaqs.push({ question, answer })
      }
    }
  }

  const jsonLdFaq =
    extractedFaqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: extractedFaqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null

  return (
    <article className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8 relative">
      <MetaPixel pixelId={(post as any).metaPixelId} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      {jsonLdFaq && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
        />
      )}

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

      {/* Featured Banner with Fallback & CLS Fix */}
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

      {/* Article Content Body */}
      <main className="max-w-4xl mx-auto prose prose-invert prose-emerald lg:prose-lg leading-relaxed text-foreground/90">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </main>

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
