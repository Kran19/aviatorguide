import React from 'react';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = await prisma.post.findUnique({
    where: { slug: resolvedParams.slug },
  });

  if (!post) return { title: 'Post Not Found' };

  return {
    title: `${post.title} - betsetgo.xyz`,
    description: post.excerpt || post.title,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = await prisma.post.findUnique({
    where: { slug: resolvedParams.slug, published: true },
    include: {
      categories: true,
      author: true,
    },
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/blog" className="text-primary hover:underline mb-8 inline-block">
        &larr; Back to blog
      </Link>
      
      <article className="prose prose-lg dark:prose-invert max-w-none">
        <div className="mb-8">
          <div className="flex gap-2 mb-4">
            {post.categories.map(cat => (
              <span key={cat.id} className="text-sm font-semibold text-primary uppercase tracking-wider">
                {cat.name}
              </span>
            ))}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            {post.title}
          </h1>
          <p className="text-muted-foreground">
            By {post.author.name || 'Anonymous'} on {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>

        {post.featuredImage && (
          <div className="w-full h-[400px] md:h-[500px] overflow-hidden rounded-xl mb-12 bg-muted">
            <img 
              src={post.featuredImage} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="whitespace-pre-wrap font-serif text-lg leading-relaxed text-foreground/90">
          {post.content}
        </div>
      </article>
    </div>
  );
}
