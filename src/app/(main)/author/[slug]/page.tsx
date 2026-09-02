import { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { SafeImage } from "@/components/ui/SafeImage"
import { PostCardItem } from "@/components/blog/PostCardItem"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  User,
  BookOpen,
  Sparkles,
  ShieldCheck,
  Globe,
  ArrowLeft,
  Calendar,
  Layers,
} from "lucide-react"

export const dynamic = "force-dynamic"

interface AuthorPageProps {
  params: Promise<{ slug: string }>
}

function safeJsonLd(data: object): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params
  let author: any = null

  try {
    author = await prisma.author.findUnique({
      where: { slug },
    })

    if (!author) {
      author = await prisma.user.findFirst({
        where: {
          OR: [
            { slug },
            { name: { mode: "insensitive", equals: slug.replace(/-/g, " ") } },
          ],
        },
      })
    }
  } catch (err) {
    console.warn("Database unreachable during author metadata generation.", err)
  }

  if (!author) {
    return { title: "Author Profile | betsetgo.xyz" }
  }

  const title = `${author.name} - Official Author & Contributor | betsetgo.xyz`
  const description =
    author.bio ||
    `Explore gaming articles, reviews, and eSports insights written by ${author.name} on betsetgo.xyz.`
  const canonicalUrl = `https://betsetgo.xyz/author/${author.slug || slug}`
  const image = author.image || "https://betsetgo.xyz/images/default-blog-banner.svg"

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
      type: "profile",
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  }
}

export default async function AuthorProfilePage({ params }: AuthorPageProps) {
  const { slug } = await params

  let author: any = null
  let posts: any[] = []

  try {
    // 1. Try finding in dedicated Author model
    author = await prisma.author.findUnique({
      where: { slug },
      include: {
        posts: {
          where: { status: "PUBLISHED" },
          orderBy: { createdAt: "desc" },
          include: {
            categories: true,
          },
        },
      },
    })

    if (author) {
      posts = author.posts || []
    } else {
      // 2. Fallback to User model
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { slug },
            { name: { mode: "insensitive", equals: slug.replace(/-/g, " ") } },
          ],
        },
        include: {
          posts: {
            where: { status: "PUBLISHED" },
            orderBy: { createdAt: "desc" },
            include: {
              categories: true,
            },
          },
        },
      })

      if (user) {
        author = user
        posts = user.posts || []
      }
    }
  } catch (err) {
    console.warn("Database unreachable during author page load.", err)
  }

  if (!author) {
    notFound()
  }

  const authorName = author.name || "Gaming Author"
  const authorDesignation = author.designation || "Content Creator & Gaming Analyst"
  const authorBio =
    author.bio ||
    "BetSetGo content specialist bringing accurate guides, deep multiplier breakdowns, and official fair play analysis to our gaming community."
  const authorImage = author.image
  const authorCover = author.coverImage
  const socialLinks = author.socialLinks || {}
  const expertise = Array.isArray(author.expertise) ? author.expertise : []

  // Extract unique categories written by this author
  const authorCategories = Array.from(
    new Set(
      posts.flatMap((p) => p.categories?.map((c: any) => c.name) || [])
    )
  )

  const jsonLdPerson = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: authorName,
      jobTitle: authorDesignation,
      description: authorBio,
      ...(authorImage ? { image: authorImage } : {}),
      url: `https://betsetgo.xyz/author/${author.slug || slug}`,
      sameAs: Object.values(socialLinks).filter((url): url is string => typeof url === "string" && url.length > 0),
    },
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-primary/5 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLdPerson) }}
        />

        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center text-xs font-medium text-muted-foreground space-x-2">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-primary transition-colors">
            Blog
          </Link>
          <span>/</span>
          <span>Authors</span>
          <span>/</span>
          <span className="text-foreground font-semibold">{authorName}</span>
        </nav>

        {/* Author Profile Hero Card */}
        <div className="relative rounded-3xl border border-border/60 bg-card/80 backdrop-blur-xl shadow-2xl overflow-hidden">
          {/* Header Banner */}
          <div className="h-44 sm:h-60 w-full relative bg-gradient-to-r from-emerald-950 via-slate-900 to-purple-950/80 overflow-hidden">
            {authorCover ? (
              <SafeImage
                src={authorCover}
                alt={`${authorName} Banner`}
                fill
                className="object-cover opacity-60"
              />
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
          </div>

          {/* Profile Details Area */}
          <div className="px-6 sm:px-10 pb-8 sm:pb-10 -mt-20 sm:-mt-24 relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
            {/* Avatar + Main Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 text-center sm:text-left w-full md:w-auto">
              {/* Avatar */}
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-3xl overflow-hidden border-4 border-card bg-muted shadow-2xl shrink-0 group">
                {authorImage ? (
                  <SafeImage
                    src={authorImage}
                    alt={authorName}
                    fallbackText={authorName}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/30 via-emerald-600/20 to-blue-600/30 flex items-center justify-center text-primary font-black text-4xl">
                    {authorName.substring(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="absolute bottom-2 right-2 bg-primary text-slate-950 p-1.5 rounded-full shadow-lg">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>

              {/* Names & Titles */}
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Verified Creator</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
                  {authorName}
                </h1>

                <p className="text-sm sm:text-base font-semibold text-primary">
                  {authorDesignation}
                </p>
              </div>
            </div>

            {/* Stats Counter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-3 w-full md:w-auto">
              <div className="px-5 py-3 rounded-2xl bg-muted/60 border border-border/50 text-center min-w-[110px]">
                <div className="text-2xl font-black text-foreground">{posts.length}</div>
                <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  {posts.length === 1 ? "Article" : "Articles"}
                </div>
              </div>

              {authorCategories.length > 0 && (
                <div className="px-5 py-3 rounded-2xl bg-muted/60 border border-border/50 text-center min-w-[110px]">
                  <div className="text-2xl font-black text-emerald-400">{authorCategories.length}</div>
                  <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Topics
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Biography & Social Links */}
          <div className="px-6 sm:px-10 pb-8 pt-4 border-t border-border/50 space-y-6">
            <div className="space-y-2">
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">About the Author</h2>
              <p className="text-sm sm:text-base text-foreground/90 leading-relaxed max-w-4xl">
                {authorBio}
              </p>
            </div>

            {/* Expertise Badges */}
            {expertise.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">Topics & Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {expertise.map((tag: string, i: number) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-semibold"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Social Links Bar */}
            {Object.keys(socialLinks).length > 0 && (
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <span className="text-xs font-bold text-muted-foreground mr-1">Connect:</span>
                {socialLinks.twitter && (
                  <a
                    href={socialLinks.twitter}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted/60 hover:bg-sky-500/20 text-muted-foreground hover:text-sky-400 border border-border/50 text-xs font-semibold transition-all"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    <span>Twitter</span>
                  </a>
                )}
                {socialLinks.linkedin && (
                  <a
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted/60 hover:bg-blue-500/20 text-muted-foreground hover:text-blue-400 border border-border/50 text-xs font-semibold transition-all"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                    </svg>
                    <span>LinkedIn</span>
                  </a>
                )}
                {socialLinks.website && (
                  <a
                    href={socialLinks.website}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted/60 hover:bg-emerald-500/20 text-muted-foreground hover:text-emerald-400 border border-border/50 text-xs font-semibold transition-all"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Website</span>
                  </a>
                )}
                {socialLinks.github && (
                  <a
                    href={socialLinks.github}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted/60 hover:bg-foreground/20 text-muted-foreground hover:text-foreground border border-border/50 text-xs font-semibold transition-all"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
                    </svg>
                    <span>GitHub</span>
                  </a>
                )}
                {socialLinks.instagram && (
                  <a
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted/60 hover:bg-pink-500/20 text-muted-foreground hover:text-pink-400 border border-border/50 text-xs font-semibold transition-all"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                    <span>Instagram</span>
                  </a>
                )}
                {socialLinks.youtube && (
                  <a
                    href={socialLinks.youtube}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted/60 hover:bg-red-500/20 text-muted-foreground hover:text-red-400 border border-border/50 text-xs font-semibold transition-all"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                    <span>YouTube</span>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Articles Section */}
        <section className="space-y-8 pt-4">
          <div className="flex items-center justify-between pb-4 border-b border-border/50">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground flex items-center gap-2.5">
                <BookOpen className="h-6 w-6 text-primary" />
                <span>Published Articles</span>
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                All articles and reviews published by {authorName}
              </p>
            </div>
            <Link
              href="/blog"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary transition-colors"
            >
              <span>Explore All Drops</span>
              <span>→</span>
            </Link>
          </div>

          {posts.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border p-12 text-center bg-card/40">
              <BookOpen className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-foreground">No Published Articles Yet</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
                {authorName} has not published any articles yet. Check back soon for exciting new gaming guides and drops.
              </p>
              <Button variant="outline" className="mt-6 rounded-full" asChild>
                <Link href="/blog">Browse Other Blog Posts</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <PostCardItem key={post.id} post={post} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
