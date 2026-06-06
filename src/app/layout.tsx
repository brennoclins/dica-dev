import './globals.css'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { SITE_CONFIG } from '@/lib/site'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Dica Dev',
    template: '%s | Dica Dev',
  },
  description: 'Um blog com dicas para desenvolvedores de software',
  authors: [{ name: 'Brenno Clins' }],
  creator: 'Brenno Clins',
  applicationName: 'Dica Dev',
  generator: 'Next.js',
  keywords: ['dev', 'developer', 'blog', 'programming', 'webdev', 'dicas'],
  metadataBase: new URL('https://dica-dev.vercel.app'),
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': '/feed.xml',
    },
  },
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
  appleWebApp: {
    capable: true,
    title: SITE_CONFIG.name,
    statusBarStyle: 'black-translucent',
  },
  formatDetection: { telephone: false },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Dica Dev',
    title: 'Dica Dev',
    description: 'Um blog com dicas para desenvolvedores de software',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dica Dev',
    description: 'Um blog com dicas para desenvolvedores de software',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
