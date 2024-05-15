import './globals.css'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { GithubContextProvider } from '@/context/GithubContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Dica Dev',
  description: 'DicaDev um blog com dicas para desenvolvedores de softwares',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <GithubContextProvider>
      <html lang="pt-br">
        <body className={inter.className}>{children}</body>
      </html>
    </GithubContextProvider>
  )
}
