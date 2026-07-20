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
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
