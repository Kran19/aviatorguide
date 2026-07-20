import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Hero } from "@/components/home/hero/Hero"
import { prisma } from "@/lib/prisma"
import Image from "next/image"
import { Gamepad2 } from 'lucide-react'


export const revalidate = 60; // Revalidate page every 60 seconds (ISR)

export default async function Home() {
  let settings = null;
  let latestPosts: any[] = [];

  try {
    settings = await prisma.globalSettings.findUnique({
      where: { id: "global" }
    })
    
    latestPosts = await prisma.post.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      take: 6,
      include: {
        categories: true,
        author: true
      }
    })
  } catch (error) {
    console.warn("Database unreachable during build time. Falling back to empty state for prerendering.", error);
  }

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Hero Section with 3D Cinematic Vibe */}
      <Hero />

      {/* Latest Posts Section */}
      <section className="py-24 bg-muted/30 border-t border-border/50 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Latest Drops</h2>
              <p className="text-muted-foreground text-lg">Fresh content straight from the servers.</p>
            </div>
            <Button variant="ghost" className="hidden sm:flex" asChild>
              <Link href="/blog">View All Posts →</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestPosts.map((post: any) => (
              <Link href={`/blog/${post.slug}`} key={post.id} className="group h-full">
                <article className="flex flex-col h-full bg-card rounded-2xl overflow-hidden border border-border/50 shadow-lg hover:shadow-2xl transition-all duration-300 transform perspective-1000 hover:rotate-y-2 hover:-translate-y-2 group-hover:border-primary/50 relative">
                  {/* Glassmorphism shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10" />
                  
                  <div className="relative h-56 w-full overflow-hidden bg-muted">
                    {post.featuredImage ? (
                      <Image
                        src={post.featuredImage}
                        alt={(post as any).featuredImageAlt || post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center p-4 text-center">
                        <span className="text-muted-foreground font-semibold line-clamp-3">
                          {(post as any).featuredImageAlt || "No Image"}
                        </span>
                      </div>
                    )}
                    {post.categories[0] && (
                      <div className="absolute top-4 left-4 z-20">
                        <span className="bg-background/80 backdrop-blur-md border border-white/10 px-3 py-1 text-xs font-semibold rounded-full shadow-lg text-foreground">
                          {post.categories[0].name}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6 flex flex-col flex-1 relative z-20">
                    <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-1">
                      {post.excerpt || "Click to read more about this topic..."}
                    </p>
                    
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white overflow-hidden flex items-center justify-center p-[2px] border border-border shadow-sm">
                          <Image src="/rocky-logo.png" alt="rocky11.club" width={32} height={32} className="w-full h-full object-contain rounded-full" />
                        </div>
                        <span className="text-sm font-bold text-foreground">rocky11.club</span>
                      </div>
                      <time className="text-xs text-muted-foreground font-medium">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </time>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
          
          <div className="mt-10 flex justify-center sm:hidden">
            <Button variant="outline" size="lg" className="w-full rounded-full" asChild>
              <Link href="/blog">View All Posts</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Floating Action Button */}
      <a 
        href="https://rocky11.club/?refercode=SEO" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 group flex flex-col items-center animate-[bounce_3s_infinite]"
      >
        <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-[#00D09C] to-[#00ffcc] shadow-[0_0_20px_rgba(0,208,156,0.5)] text-black mb-2 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(0,208,156,0.8)] overflow-hidden">
          {/* Shine effect */}
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent group-hover:animate-[shimmer_1.5s_infinite] skew-x-12" />
          <Gamepad2 className="w-8 h-8 z-10" />
        </div>
        <span className="bg-background/90 backdrop-blur-sm border border-border/50 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg text-foreground group-hover:text-[#00D09C] transition-colors whitespace-nowrap">
          Join our games
        </span>
      </a>
    </div>
  )
}
