import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'I Sports Game Guide - Premier Gaming & Esports Guides',
    short_name: 'ISportsGuide',
    description: 'Your premier destination for i-sports guides, crash game mechanics, sports analytics, and competitive gameplay intelligence.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#00D09C',
    icons: [
      {
        src: '/favicon-48x48.png',
        sizes: '48x48',
        type: 'image/png',
      },
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
