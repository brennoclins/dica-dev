export const SUPPORTED_LOCALES = ['pt-BR', 'en'] as const
export type Locale = (typeof SUPPORTED_LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'pt-BR'

const dictionaries = {
  'pt-BR': {
    'site.title': 'Dica Dev',
    'site.description': 'Um blog com dicas para desenvolvedores de software',
    'home.heading': 'Dica Dev',
    'home.publications': 'Publicações',
    'home.publication': 'Publicação',
    'home.search.placeholder': 'Buscar por título, conteúdo ou label...',
    'home.search.aria': 'Buscar publicações',
    'home.search.count.one': '1 Publicação',
    'home.search.count.other': '{count} Publicações',
    'home.search.empty': 'Nenhuma publicação encontrada',
    'home.search.empty.withQuery':
      'Nenhuma publicação encontrada para "{query}".',
    'home.search.empty.withLabel':
      'Nenhuma publicação encontrada com a label "{label}".',
    'home.search.empty.withBoth':
      'Nenhuma publicação encontrada para "{query}" com a label "{label}".',
    'home.filter.label': 'Filtrar por categoria',
    'home.filter.clear': 'Limpar',
    'home.filter.clear.filters': 'Limpar filtros',
    'home.read.more': 'Click e leia mais...',
    'home.load.more': 'Carregar mais publicações',
    'home.load.more.loading': 'Carregando...',
    'home.load.more.empty': 'Nenhuma publicação adicional encontrada.',
    'home.back': 'VOLTAR',
    'post.toc.title': 'Sumario',
    'post.reading.time': '{minutes} min de leitura',
    'post.tags': 'Tags',
    'post.comments.title': 'Comentarios',
    'post.comments.hint':
      'Comentarios sao armazenados como GitHub Discussions neste post (#{number}: {title}). Faca login com sua conta GitHub para participar.',
    'post.comments.loading': 'Carregando comentarios...',
    'post.related.title': 'Posts relacionados',
    'post.share.title': 'Compartilhar',
    'post.share.copy': 'Copiar link',
    'post.share.copied': 'Copiado!',
    'post.share.x': 'Compartilhar no X (Twitter)',
    'post.share.linkedin': 'Compartilhar no LinkedIn',
    'post.share.reddit': 'Compartilhar no Reddit',
    'theme.toggle.dark': 'Mudar para tema escuro',
    'theme.toggle.light': 'Mudar para tema claro',
    'theme.toggle.aria': 'Alternar tema',
    'rate.limit.title': 'Limite da API do GitHub atingido',
    'rate.limit.hint':
      'Para continuar desenvolvendo localmente, adicione um token pessoal no arquivo .env.local:',
    'rate.limit.token.label': 'GITHUB_TOKEN=ghp_seu_token_aqui',
    'rate.limit.create': 'Criar token no GitHub',
    'error.404.title': 'Pagina nao encontrada',
  },
  en: {
    'site.title': 'Dica Dev',
    'site.description': 'A blog with tips for software developers',
    'home.heading': 'Dica Dev',
    'home.publications': 'Posts',
    'home.publication': 'Post',
    'home.search.placeholder': 'Search by title, content or label...',
    'home.search.aria': 'Search posts',
    'home.search.count.one': '1 Post',
    'home.search.count.other': '{count} Posts',
    'home.search.empty': 'No posts found',
    'home.search.empty.withQuery': 'No posts found for "{query}".',
    'home.search.empty.withLabel': 'No posts found with the label "{label}".',
    'home.search.empty.withBoth':
      'No posts found for "{query}" with the label "{label}".',
    'home.filter.label': 'Filter by category',
    'home.filter.clear': 'Clear',
    'home.filter.clear.filters': 'Clear filters',
    'home.read.more': 'Click and read more...',
    'home.load.more': 'Load more posts',
    'home.load.more.loading': 'Loading...',
    'home.load.more.empty': 'No additional posts found.',
    'home.back': 'BACK',
    'post.toc.title': 'Table of contents',
    'post.reading.time': '{minutes} min read',
    'post.tags': 'Tags',
    'post.comments.title': 'Comments',
    'post.comments.hint':
      'Comments are stored as GitHub Discussions on this post (#{number}: {title}). Log in with your GitHub account to participate.',
    'post.comments.loading': 'Loading comments...',
    'post.related.title': 'Related posts',
    'post.share.title': 'Share',
    'post.share.copy': 'Copy link',
    'post.share.copied': 'Copied!',
    'post.share.x': 'Share on X (Twitter)',
    'post.share.linkedin': 'Share on LinkedIn',
    'post.share.reddit': 'Share on Reddit',
    'theme.toggle.dark': 'Switch to dark theme',
    'theme.toggle.light': 'Switch to light theme',
    'theme.toggle.aria': 'Toggle theme',
    'rate.limit.title': 'GitHub API rate limit reached',
    'rate.limit.hint':
      'To keep developing locally, add a personal token to the .env.local file:',
    'rate.limit.token.label': 'GITHUB_TOKEN=ghp_your_token_here',
    'rate.limit.create': 'Create token on GitHub',
    'error.404.title': 'Page not found',
  },
} as const

export type TranslationKey = keyof (typeof dictionaries)['pt-BR']

function interpolate(
  template: string,
  values: Record<string, string | number> = {}
): string {
  return template.replace(/\{(\w+)\}/g, (_, key) =>
    values[key] !== undefined ? String(values[key]) : `{${key}}`
  )
}

export function createTranslator(locale: Locale) {
  const dict = dictionaries[locale] ?? dictionaries[DEFAULT_LOCALE]
  return function t(
    key: TranslationKey,
    values?: Record<string, string | number>
  ): string {
    const raw = dict[key] ?? dictionaries[DEFAULT_LOCALE][key] ?? key
    return interpolate(raw, values)
  }
}

export function resolveLocale(input: string | null | undefined): Locale {
  if (input === 'en') return 'en'
  return DEFAULT_LOCALE
}

export function isLocale(value: string): value is Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value)
}
