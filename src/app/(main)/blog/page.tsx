import React from 'react';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

import Image from 'next/image';

export const revalidate = 60; // ISR
export const metadata = {
  title: 'Blog - betsetgo.xyz',
  description: 'Read our latest gaming blog posts.',
  alternates: {
    canonical: '/blog',
  },
};

export default async function BlogPage() {
  let posts: any[] = [];
  try {
    posts = await prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' },
      include: { categories: true },
    });
  } catch (e) {
    console.warn("Database unreachable during build time for blog page.", e);
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* 3D ambient backgrounds */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 blur-[150px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/20 blur-[150px] rounded-full -z-10" />
      
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 bg-gradient-to-br from-foreground to-foreground/50 bg-clip-text text-transparent">
            Latest Posts
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Dive into the latest insights, strategies, and updates from the gaming world.
          </p>
        </div>
        
        {posts.length === 0 ? (
          <div className="text-center py-20 glass-card rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl bg-background/60">
            <p className="text-2xl text-muted-foreground font-semibold">
              Content is coming soon! Check back later.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post: any) => (
              <Link href={`/blog/${post.slug}`} key={post.id} className="group block h-full">
                <div className="h-full flex flex-col overflow-hidden rounded-3xl border border-white/10 shadow-xl backdrop-blur-xl bg-background/40 hover:bg-background/60 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:-translate-y-2 group-hover:border-primary/50 relative">
                  
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  {post.featuredImage ? (
                    <div className="w-full h-56 overflow-hidden bg-muted relative">
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                      <Image
                        src={post.featuredImage}
                        alt={(post as any).featuredImageAlt || post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-56 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center p-4 text-center">
                        <span className="text-muted-foreground font-semibold line-clamp-3">
                          {(post as any).featuredImageAlt || "No Image"}
                        </span>
                    </div>
                  )}
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.categories.map((cat: any) => (
                        <span key={cat.id} className="text-xs font-bold text-primary-foreground bg-primary/90 px-2 py-1 rounded-md uppercase tracking-wider shadow-sm group-hover:bg-primary transition-colors">
                          {cat.name}
                        </span>
                      ))}
                    </div>
                    <h2 className="text-2xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300">
                      {post.title}
                    </h2>
                    <p className="text-muted-foreground line-clamp-3 mb-6 flex-1 text-sm md:text-base">
                      {post.excerpt || (post.content.replace(/<[^>]*>?/gm, '').substring(0, 150) + "...")}
                    </p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground font-medium pt-4 border-t border-border/50">
                      <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span className="text-primary group-hover:translate-x-1 transition-transform duration-300 flex items-center gap-1">
                        Read more &rarr;
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
