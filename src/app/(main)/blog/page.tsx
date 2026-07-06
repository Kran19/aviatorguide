import React from 'react';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata = {
  title: 'Blog - betsetgo.xyz',
  description: 'Read our latest gaming blog posts.',
};

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    include: { categories: true },
  });

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold tracking-tight mb-8">Latest Posts</h1>
      
      {posts.length === 0 ? (
        <p className="text-lg text-muted-foreground">
          Welcome to the blog. Content is coming soon!
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Card key={post.id} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
              {post.featuredImage && (
                <div className="w-full h-48 overflow-hidden bg-muted">
                  <img 
                    src={post.featuredImage} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex gap-2 mb-2">
                  {post.categories.map(cat => (
                    <span key={cat.id} className="text-xs font-semibold text-primary uppercase tracking-wider">
                      {cat.name}
                    </span>
                  ))}
                </div>
                <CardTitle className="line-clamp-2">
                  <Link href={`/blog/${post.slug}`} className="hover:underline">
                    {post.title}
                  </Link>
                </CardTitle>
                <CardDescription>
                  {new Date(post.createdAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-muted-foreground line-clamp-3">
                  {post.excerpt || post.content.substring(0, 150) + "..."}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
