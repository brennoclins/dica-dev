export const SITE_CONFIG = {
  name: 'Dica Dev',
  shortName: 'Dica Dev',
  description: 'Um blog com dicas para desenvolvedores de software',
  author: 'Brenno Clins',
  locale: 'pt-BR',
  githubRepo: 'https://github.com/brennoclins/dica-dev',
  keywords: ['dev', 'developer', 'blog', 'programming', 'webdev', 'dicas'],
}

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dica-dev.vercel.app'

const DEFAULT_META_LABELS = ['meta', '_meta', 'internal', '_internal', 'admin']

function parseExcludeLabels(raw: string | undefined): string[] {
  if (!raw) return DEFAULT_META_LABELS
  const custom = raw
    .split(',')
    .map(label => label.trim().toLowerCase())
    .filter(Boolean)
  return Array.from(new Set([...DEFAULT_META_LABELS, ...custom]))
}

export const EXCLUDE_LABELS: readonly string[] = parseExcludeLabels(
  process.env.GITHUB_EXCLUDE_LABELS
)

export function isExcludedByLabel(
  labels: ReadonlyArray<{ name: string }>
): boolean {
  const labelSet = new Set(EXCLUDE_LABELS)
  return labels.some(label => labelSet.has(label.name.toLowerCase()))
}
