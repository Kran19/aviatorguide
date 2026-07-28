import React from 'react'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { SafeImage } from '@/components/ui/SafeImage'
import { ArrowLeft, BookOpen, Calendar, Globe, CheckCircle2, User } from 'lucide-react'

export const revalidate = 60 // ISR

interface AuthorPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: AuthorPageProps) {
  const resolvedParams = await params
  const slug = resolvedParams.slug

  let user = null
  try {
    user = await prisma.user.findFirst({
      where: {
        OR: [
          { slug: slug },
          { id: slug }
        ]
      }
    })
  } catch (e) {}

  const authorName = user?.name || "rocky11.club"
  const title = `${authorName} - Author Profile | betsetgo.xyz`
  const description = user?.bio || `Read articles, gaming strategies, and guides written by ${authorName} on betsetgo.xyz.`
  const url = `https://betsetgo.xyz/author/${slug}`
  const image = user?.image || "https://betsetgo.xyz/rocky-logo.png"

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
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
  const resolvedParams = await params
  const slug = resolvedParams.slug

  let author: any = null
  let posts: any[] = []

  try {
    author = await prisma.user.findFirst({
      where: {
        OR: [
          { slug: slug },
          { id: slug }
        ]
      }
    })

    // If author not found by slug/id in DB, but matches default "rocky11" slug fallback
    if (!author && (slug === 'rocky11-club' || slug === 'rocky11' || slug === 'admin')) {
      author = {
        name: "rocky11.club",
        slug: "rocky11-club",
        designation: "Official Author & Head Analyst",
        bio: "BetSetGo is a trusted real money gaming platform dedicated to delivering a fair, secure, and enjoyable gaming experience. Our content team combines years of expertise in online gaming, sports analysis, and platform mechanics to bring you accurate guides, game reviews, and responsible gaming information.",
        image: "/rocky-logo.png",
        coverImage: "/images/hero/01.webp",
        expertise: ["eSports", "Casino Games", "Bankroll Strategy", "Game Reviews"],
        socialLinks: {
          twitter: "https://twitter.com",
          website: "https://rocky11.club"
        }
      }
      posts = await prisma.post.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { createdAt: 'desc' },
        include: { categories: true, author: true },
      })
    } else if (author) {
      posts = await prisma.post.findMany({
        where: { authorId: author.id, status: 'PUBLISHED' },
        orderBy: { createdAt: 'desc' },
        include: { categories: true, author: true },
      })
    }
  } catch (e) {
    console.warn("Database unreachable during build time for author page.", e)
  }

  if (!author) {
    notFound()
  }

  const authorName = author.name || "rocky11.club"
  const social = (author.socialLinks as any) || {}
  const expertiseList = author.expertise || ["Gaming Strategy", "eSports Analysis", "Casino Guides"]

  // JSON-LD Person / ProfilePage Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "mainEntity": {
      "@type": "Person",
      "name": authorName,
      "description": author.bio || "Author and Analyst at betsetgo.xyz",
      "image": author.image || "https://betsetgo.xyz/rocky-logo.png",
      "jobTitle": author.designation || "Content Author",
      "worksFor": {
        "@type": "Organization",
        "name": "betsetgo.xyz",
        "url": "https://betsetgo.xyz"
      },
      "sameAs": [
        social.twitter,
        social.linkedin,
        social.github,
        social.website
      ].filter(Boolean)
    }
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-primary/15 blur-[140px] rounded-full -z-10" />

      {/* Cover Image Banner */}
      <div className="w-full h-48 sm:h-64 md:h-80 bg-gradient-to-r from-primary/30 via-purple-600/20 to-blue-600/30 relative overflow-hidden">
        {author.coverImage && (
          <SafeImage
            src={author.coverImage}
            alt={`${authorName} Cover`}
            fill
            priority
            className="object-cover opacity-40 mix-blend-overlay"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-foreground">{authorName}</span>
        </nav>

        {/* Profile Card Header */}
        <div className="glass-card rounded-3xl border border-white/10 dark:border-white/5 bg-background/80 backdrop-blur-xl p-6 sm:p-10 shadow-2xl mb-12">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
            
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-background bg-muted shadow-2xl relative">
                {author.image ? (
                  <SafeImage
                    src={author.image}
                    alt={authorName}
                    fallbackText={authorName}
                    fill
                    priority
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/30 to-purple-600/30 flex items-center justify-center text-primary font-black text-4xl">
                    {authorName.substring(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="absolute bottom-2 right-2 bg-emerald-500 text-black rounded-full p-1 shadow-lg" title="Verified Author">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>

            {/* Author Info */}
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                  <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
                    {authorName}
                  </h1>
                  <span className="bg-primary/10 border border-primary/30 text-primary font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                    {author.designation || "Verified Author"}
                  </span>
                </div>
                <p className="text-muted-foreground text-base sm:text-lg max-w-3xl leading-relaxed">
                  {author.bio || "Gaming strategy writer and analyst sharing high-level meta insights, bankroll management tips, and game reviews."}
                </p>
              </div>

              {/* Expertise Pills */}
              {expertiseList.length > 0 && (
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-2">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mr-1">Expertise:</span>
                  {expertiseList.map((item: string, idx: number) => (
                    <span key={idx} className="bg-muted/80 border border-border/50 text-foreground text-xs font-medium px-3 py-1 rounded-full">
                      {item}
                    </span>
                  ))}
                </div>
              )}

              {/* Social Links & Stats */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 pt-4 border-t border-border/40 text-sm">
                <div className="flex items-center gap-2 text-foreground font-bold">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <span>{posts.length} Published {posts.length === 1 ? 'Article' : 'Articles'}</span>
                </div>

                <div className="flex items-center gap-3">
                  {social.twitter && (
                    <a href={social.twitter} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-muted hover:bg-primary/20 hover:text-primary transition-colors" title="Twitter / X">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </a>
                  )}
                  {social.linkedin && (
                    <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-muted hover:bg-blue-500/20 hover:text-blue-400 transition-colors" title="LinkedIn">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                      </svg>
                    </a>
                  )}
                  {social.github && (
                    <a href={social.github} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-muted hover:bg-foreground/20 hover:text-foreground transition-colors" title="GitHub">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
                      </svg>
                    </a>
                  )}
                  {social.website && (
                    <a href={social.website} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-muted hover:bg-emerald-500/20 hover:text-emerald-400 transition-colors" title="Website">
                      <Globe className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Published Articles Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Articles by {authorName}
              </h2>
              <p className="text-muted-foreground text-sm">Explore all published articles and strategic guides.</p>
            </div>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-16 glass-card rounded-3xl border border-border/50">
              <p className="text-lg text-muted-foreground">No articles published by this author yet.</p>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post: any) => (
                <Link href={`/blog/${post.slug}`} key={post.id} className="group block h-full">
                  <div className="h-full flex flex-col overflow-hidden rounded-3xl border border-white/10 shadow-xl backdrop-blur-xl bg-background/40 hover:bg-background/60 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:-translate-y-2 group-hover:border-primary/50 relative">
                    <div className="w-full h-52 overflow-hidden bg-muted relative">
                      <SafeImage
                        src={post.featuredImage}
                        alt={post.title}
                        fallbackText={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>

                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.categories?.map((cat: any) => (
                          <span key={cat.id} className="text-[10px] font-bold text-primary-foreground bg-primary/90 px-2 py-0.5 rounded uppercase tracking-wider">
                            {cat.name}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground line-clamp-3 text-sm mb-6 flex-1">
                        {post.excerpt || "Click to read the full article."}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground font-medium pt-4 border-t border-border/50 mt-auto">
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        <span className="text-primary font-bold group-hover:translate-x-1 transition-transform">
                          Read article &rarr;
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
