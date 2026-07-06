import React from 'react';

export const metadata = {
  title: 'About - betsetgo.xyz',
  description: 'Learn more about betsetgo.xyz.',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold tracking-tight mb-8">About</h1>
      <p className="text-lg text-muted-foreground">
        We are a premium technology blog. More information coming soon!
      </p>
    </div>
  );
}
