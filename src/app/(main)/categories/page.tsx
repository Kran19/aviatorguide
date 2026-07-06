import React from 'react';

export const metadata = {
  title: 'Categories - betsetgo.xyz',
  description: 'Browse blog posts by category.',
};

export default function CategoriesPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold tracking-tight mb-8">Categories</h1>
      <p className="text-lg text-muted-foreground">
        Browse our posts by category. Categories are coming soon!
      </p>
    </div>
  );
}
