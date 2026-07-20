import React from 'react';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import Image from 'next/image';

export const revalidate = 60; // ISR
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  let post = null;
  try {
    post = await prisma.post.findUnique({
      where: { slug: resolvedParams.slug },
    });
  } catch (e) {}

  if (!post) return { title: 'Post Not Found' };

  const title = post.metaTitle || `${post.title} - betsetgo.xyz`;
  const description = post.metaDescription || post.excerpt || post.title;
  const url = `/blog/${post.slug}`;

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
      authors: ["rocky11.club"],
      images: post.featuredImage ? [{ url: post.featuredImage }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.featuredImage ? [post.featuredImage] : [],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  let post = null;
  try {
    post = await prisma.post.findUnique({
      where: { slug: resolvedParams.slug, status: 'PUBLISHED' },
      include: {
        categories: true,
        author: true,
      },
    });
  } catch (e) {
    console.warn("Database unreachable during build time for blog post.", e);
  }

  if (!post) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || post.metaDescription || post.title,
    image: post.featuredImage ? [post.featuredImage] : [],
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt ? post.updatedAt.toISOString() : post.createdAt.toISOString(),
    author: [{
      "@type": "Organization",
      "name": "rocky11.club",
      "url": "https://betsetgo.xyz"
    }]
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* 3D ambient backgrounds */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] rounded-full -z-10" />
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-blue-500/10 blur-[100px] rounded-full -z-10" />

      <div className="w-full max-w-none px-4 sm:px-6 lg:px-8 pt-4 pb-12">
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-primary hover:text-primary/80 transition-colors mb-4 bg-primary/10 px-3 py-1.5 rounded-full text-sm font-medium hover:shadow-[0_0_15px_rgba(var(--primary),0.3)] duration-300">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to blog
        </Link>

        <article className="glass-card p-8 md:p-12 rounded-3xl border border-white/10 dark:border-white/5 shadow-2xl relative overflow-hidden backdrop-blur-xl bg-background/60">

          {/* Game Widget */}
          {(post as any).playImage && (
            <div className="flex flex-col items-center justify-center mb-12 max-w-sm mx-auto">
              <div className="w-full aspect-square rounded-2xl overflow-hidden mb-6 bg-muted relative shadow-lg">
                <Image
                  src={(post as any).playImage}
                  alt={(post as any).playImageAlt || post.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex w-full gap-3">
                <a
                  href="https://rocky11.club/?refercode=SEO"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-[#00D09C] hover:bg-[#00D09C]/90 text-black font-bold py-3 rounded-xl text-center transition-colors shadow-lg"
                >
                  Play Now
                </a>
              </div>
            </div>
          )}

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
              <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>

          {post.featuredImage && (
            <div className="w-full max-w-4xl mx-auto h-[400px] md:h-[500px] overflow-hidden rounded-2xl mb-12 bg-muted relative group shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Image
                src={post.featuredImage}
                alt={(post as any).featuredImageAlt || post.title}
                fill
                priority
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          )}

          <div
            className="prose prose-lg dark:prose-invert max-w-none prose-p:leading-normal prose-p:my-1 prose-headings:font-bold prose-headings:my-1 prose-li:my-0 prose-ul:my-1 prose-ol:my-1 prose-a:text-blue-600 hover:prose-a:text-blue-700 dark:prose-a:text-blue-400 dark:hover:prose-a:text-blue-300 prose-img:rounded-xl prose-img:shadow-xl"
            dangerouslySetInnerHTML={{ 
              __html: post.content.replace(/<(h[1-6])([^>]*)>(.*?)<\/\1>/gi, '<$1$2><strong>$3</strong></$1>') 
            }}
          />

          {/* Author Details Box */}
          <div className="mt-16 pt-8 border-t border-border/50">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="w-20 h-20 rounded-full overflow-hidden shrink-0 bg-white border-2 border-border shadow-lg flex items-center justify-center p-2">
                <Image
                  src="/rocky-logo.png"
                  alt="rocky11.club"
                  width={64}
                  height={64}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-1 text-foreground">rocky11.club</h3>
                <p className="text-muted-foreground font-medium mb-3 text-sm">Official Author</p>
                <p className="text-muted-foreground mb-3 leading-relaxed text-sm">
                  BetSetGo is a trusted real money gaming platform dedicated to delivering a fair, secure, and enjoyable gaming experience. Our content team combines years of expertise in online gaming, sports analysis, and platform mechanics to bring you accurate guides, game reviews, and responsible gaming information. Every article is researched and reviewed to ensure you get reliable, up-to-date information — helping you play smart and stay informed.
                </p>
                <a href="#" target="_blank" rel="noopener noreferrer" className="text-primary font-bold text-sm hover:underline">
                  Read full bio
                </a>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
