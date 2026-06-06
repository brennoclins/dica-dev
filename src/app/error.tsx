'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { ArrowClockwise, House, WarningCircle } from '@phosphor-icons/react/dist/ssr'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error('[App Error]', error)
  }, [error])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-base-background p-6 text-base-text">
      <WarningCircle size={64} className="text-red-gladiator" weight="fill" />

      <div className="flex max-w-xl flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-bold text-base-title">Algo deu errado</h1>
        <p className="text-base-span">
          Não foi possível carregar o conteúdo do blog. Isso pode ter sido um
          problema temporário com a API do GitHub ou de rede.
        </p>
        {error?.digest && (
          <code className="mt-2 text-xs text-base-label">
            id: {error.digest}
          </code>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="flex items-center gap-2 rounded-lg bg-red-gladiator px-4 py-2 font-bold text-white transition-opacity hover:opacity-90"
        >
          <ArrowClockwise size={20} weight="bold" />
          Tentar novamente
        </button>

        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg border border-base-border px-4 py-2 text-base-subtitle transition-colors hover:border-red-gladiator hover:text-red-gladiator"
        >
          <House size={20} weight="bold" />
          Voltar para Home
        </Link>
      </div>
    </main>
  )
}
