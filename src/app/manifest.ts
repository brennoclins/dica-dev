import type { MetadataRoute } from 'next'

import { SITE_CONFIG, SITE_URL } from '@/lib/site'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_CONFIG.name,
    short_name: SITE_CONFIG.shortName,
    description: SITE_CONFIG.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#071422',
    theme_color: '#3294F8',
    icons: [
      {
        src: '/icon.png',
        sizes: 'any',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    categories: ['developer', 'technology', 'education'],
    lang: SITE_CONFIG.locale,
    orientation: 'portrait',
    scope: '/',
  }
}
