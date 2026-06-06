export default function Loading() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-base-background text-base-text">
      <div
        className="h-12 w-12 animate-spin rounded-full border-4 border-base-border border-t-red-gladiator"
        role="status"
        aria-label="Carregando"
      />
      <p className="text-sm text-base-span">Carregando publicações...</p>
    </main>
  )
}
