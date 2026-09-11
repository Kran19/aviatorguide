import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'BetSetGo Premium Gaming Blog',
    short_name: 'BetSetGo',
    description: 'A premium gaming blog covering eSports, RPGs, and the latest in the gaming world.',
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
