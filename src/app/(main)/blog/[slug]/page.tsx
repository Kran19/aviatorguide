import React from 'react';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = await prisma.post.findUnique({
    where: { slug: resolvedParams.slug },
  });

  if (!post) return { title: 'Post Not Found' };

  return {
    title: post.metaTitle || `${post.title} - betsetgo.xyz`,
    description: post.metaDescription || post.excerpt || post.title,
    keywords: post.focusKeyword ? [post.focusKeyword] : [],
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = await prisma.post.findUnique({
    where: { slug: resolvedParams.slug, status: 'PUBLISHED' },
    include: {
      categories: true,
      author: true,
    },
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* 3D ambient backgrounds */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] rounded-full -z-10" />
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-blue-500/10 blur-[100px] rounded-full -z-10" />
      
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/blog" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8 bg-primary/10 px-4 py-2 rounded-full font-medium hover:shadow-[0_0_15px_rgba(var(--primary),0.3)] duration-300">
          <ArrowLeft className="w-4 h-4" /> Back to blog
        </Link>
        
        <article className="glass-card p-8 md:p-12 rounded-3xl border border-white/10 dark:border-white/5 shadow-2xl relative overflow-hidden backdrop-blur-xl bg-background/60">
          <div className="mb-8 text-center">
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {post.categories.map((cat: any) => (
                <span key={cat.id} className="text-xs font-bold text-primary-foreground bg-primary px-3 py-1 rounded-full uppercase tracking-wider shadow-lg shadow-primary/20">
                  {cat.name}
                </span>
              ))}
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
              {post.title}
            </h1>
            <div className="flex items-center justify-center gap-4 text-muted-foreground font-medium">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-blue-500 flex items-center justify-center text-white shadow-lg">
                  {post.author.name?.[0] || 'A'}
                </div>
                <span>{post.author.name || 'Anonymous'}</span>
              </div>
              <span>•</span>
              <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>

          {post.featuredImage && (
            <div className="w-full h-[400px] md:h-[500px] overflow-hidden rounded-2xl mb-12 bg-muted relative group shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img 
                src={post.featuredImage} 
                alt={post.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          )}

          <div 
            className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-xl prose-img:shadow-xl"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </div>
    </div>
  );
}
