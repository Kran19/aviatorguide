import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/about',
        '/contact',
        '/privacy',
        '/terms',
        '/categories/casino-game',
        '/categories/bonuses',
        '/categories/crash-game',
        '/categories/esports',
        '/categories/fps',
        '/categories/guides',
        '/categories/hh',
        '/categories/news',
        '/categories/payment',
        '/categories/reviews',
        '/categories/rpgs',
        '/categories/sports-game',
        '/categories',
        '/cgi-bin/',
        '/admin/',
      ],
    },
    sitemap: 'https://betsetgo.xyz/sitemap.xml',
  };
}
