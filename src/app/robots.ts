import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/cgi-bin/', '/admin/'],
    },
    sitemap: 'https://betsetgo.xyz/sitemap.xml',
  };
}
