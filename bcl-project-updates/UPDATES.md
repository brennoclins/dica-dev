# BCL Project Updates - Dica Dev

Historico de atualizacoes do projeto **Dica Dev** (blog renderizado a partir
de issues do GitHub).

Cada entrada abaixo documenta uma fase da modernizacao, com foco em:
- **O que mudou**: arquivos criados/alterados/removidos
- **Por que mudou**: motivacao tecnica
- **Como verificar**: comandos para reproduzir
- **Refs**: issue/commit quando aplicavel

---

## Indice

| # | Fase | Tipo | Status |
|---|------|------|--------|
| 00 | [Setup & Branch](#00--setup--branch) | Infra | OK |
| 01 | [Bug Fixes Iniciais](#01--bug-fixes-iniciais) | Fix | OK |
| 02 | [Migracao pnpm](#02--migracao-pnpm) | Chore | OK |
| 03 | [Atualizacao de Dependencias Tier 1](#03--atualizacao-de-dependencias-tier-1) | Chore | OK |
| 04 | [Refatoracao para Server Components](#04--refatoracao-para-server-components) | Refactor | OK |
| 05 | [Syntax Highlighting + GFM](#05--syntax-highlighting--gfm) | Feature | OK |
| 06 | [CSS: OKLCH + Rate-Limit Fix](#06--css-oklch--rate-limit-fix) | Fix | OK |
| 07 | [SEO: sitemap + robots + RSS + manifest + JSON-LD](#07--seo-sitemap--robots--rss--manifest--json-ld) | Feature | OK |
| 08 | [UX: TOC + Reading Time + Label Filter](#08--ux-toc--reading-time--label-filter) | Feature | OK |
| 09 | [Engagement: Share + Related Posts](#09--engagement-share--related-posts) | Feature | OK |
| 10 | [PWA + BlogProfile reativado](#10--pwa--blogprofile-reativado) | Feature | OK |
| 11 | [DX: Vitest + Husky + CI](#11--dx-vitest--husky--ci) | DX | OK |
| 11b | [Theme dark/light + Rate-Limit graceful degradation](#11b--theme-darklight--rate-limit-graceful-degradation) | Feature | OK |
| 12 | [i18n lite (PT-BR/EN)](#12--i18n-lite-pt-bren) | Feature | OK |
| 13 | [Comentarios Giscus](#13--comentarios-giscus) | Feature | OK |
| 14 | [Sentry + Observabilidade](#14--sentry--observabilidade) | DX | OK |
| 15 | [Substituir Python helper por script Node](#15--substituir-python-helper-por-script-node) | DX | OK |
| 16 | [Playwright e2e](#16--playwright-e2e) | DX | OK |

---

## 00 - Setup & Branch

**Data**: 2026-06-06
**Commit**: -
**Tipo**: Infra

### O que mudou
- Branch `feat/modernization-v2` criada a partir de `main`
- Estado inicial: 1 commit a frente da origin (apenas o estado entregue do projeto)

### Como verificar
```bash
git log --oneline main..feat/modernization-v2
```

---

## 01 - Bug Fixes Iniciais

**Data**: 2026-06-06
**Tipo**: Fix

### O que mudou
Remocoes, correcoes e melhorias menores espalhadas em 11 commits atomicos:

| Commit | Mudanca |
|--------|---------|
| `chore: migrate from npm to pnpm` | setup pnpm@11 (ver FASE 02) |
| `chore: remove next-navigation dep and rename README_RU file` | `READEM_RU.md` -> `README_RU.md` |
| `docs: update README link to renamed README_RU.md` | conserta link no `README.md` |
| `chore: remove unused formatterDate utility` | deleta `src/utils/formatterDate,ts` (typo no nome + dead code) |
| `chore: add .env.local.example template` | documenta `NEXT_PUBLIC_GITHUB_USER`, `NEXT_PUBLIC_GITHUB_REPO`, `GITHUB_TOKEN` |
| `fix(next): configure images.remotePatterns and harden defaults` | `next.config.mjs` com `images.remotePatterns` para GitHub, `reactStrictMode`, `poweredByHeader: false` |
| `fix(layout): wrap children with provider inside body, not around html` | `<GithubContextProvider>` movido para dentro de `<body>` |
| `feat(deps): migrate phosphor-react -> @phosphor-icons/react v2` | troca de lib deprecateda; usa subpath `/dist/ssr` |
| `fix(blog-profile): add Image width/height/alt and guard against empty src` | `<Image>` com `width/height={256}`, `priority`, `alt` descritivo, guard para `avatar_url` |
| `refactor(not-found): generate tile divs with Array.from + named constants` | 10 `<div>` duplicados -> `Array.from().map()`; constantes `TILE_COUNT=10` e `TILE_INDEX_OFFSET=11` |
| `feat(app): add loading.tsx and error.tsx for App Router` | spinners + error boundary client com `reset()` e `digest` |
| `fix(context): replace alert() with proper error state and add loading` | contexto com `isLoading`/`error`, `Promise.all` paralelo, cancellation flag, `Error` normalizado |

### Como verificar
```bash
pnpm typecheck
pnpm build
```

---

## 02 - Migracao pnpm

**Data**: 2026-06-06
**Tipo**: Chore

### O que mudou
- `package.json`: adicionado `packageManager: "pnpm@11.5.2"`, `engines.node >= 20`, `engines.pnpm >= 9`
- `.npmrc` criado com `auto-install-peers`, `verify-deps-before-run=false`, `strict-peer-dependencies=false`
- `pnpm-workspace.yaml` criado com `allowBuilds: { "@biomejs/biome": true, "sharp": true }` (substitui `onlyBuiltDependencies` deprecated do pnpm 10)
- Scripts: `lint`/`format`/`check`/`typecheck` configurados
- `pnpm-lock.yaml` recriado

### Por que mudou
- Solicitado explicitamente pelo usuario
- pnpm 11 e a versao mais estavel compativel com Node 24
- `allowBuilds` substitui `pnpm.onlyBuiltDependencies` (renomeado no pnpm 10+)

### Como verificar
```bash
corepack enable
pnpm install --frozen-lockfile
pnpm -v   # esperado: 11.5.2
```

---

## 03 - Atualizacao de Dependencias Tier 1

**Data**: 2026-06-06
**Tipo**: Chore

### O que mudou

| Pacote | De | Para |
|--------|----|----|
| `@biomejs/biome` | 1.9.4 | 2.4.16 |
| `react` | 18.3.1 | 19.2.7 |
| `react-dom` | 18.3.1 | 19.2.7 |
| `@types/react` | 18.x | 19.2.16 |
| `@types/react-dom` | 18.x | 19.2.3 |
| `next` | 14.2.35 | 16.2.7 |
| `tailwindcss` | 3.4.19 | 4.3.0 |
| `@tailwindcss/postcss` | - | 4.3.0 |

### Biome 2 ajustes
- `organizeImports` -> `assist.actions.source.organizeImports`
- `files.ignore` -> `files.includes` com `!` negations
- `css.parser.tailwindDirectives: true`, `css.parser.cssModules: true`
- `css.formatter`/`css.linter` desativados
- Excluidos `*.css` e `next-env.d.ts`

### Next 16 + React 19 ajustes
- `tsconfig.json` auto-atualizado: `jsx: "react-jsx"`, `target: "ES2017"`, adicionado `.next/dev/types/**/*.ts` ao `include`
- `posts/[id]/page.tsx` migrado para `props: { params: Promise<{ id: string }> }` com `use(props.params)` (codemod)

### Tailwind 4 ajustes
- `tailwind.config.ts` deletado
- `src/app/globals.css` reescrito com `@import "tailwindcss"` + `@theme` block
- `postcss.config.mjs` usa apenas `'@tailwindcss/postcss'`
- Todos os 5 arquivos `*.module.css` ganharam `@reference "<path-to-globals>"`

### Como verificar
```bash
pnpm typecheck && pnpm check && pnpm build
# esperado: 50 posts SSG (com token), 0 errors
```

---

## 04 - Refatoracao para Server Components

**Data**: 2026-06-06
**Tipo**: Refactor

### O que mudou

#### Novo: `src/lib/github.ts`
- `import 'server-only'`, `GITHUB_USER`/`GITHUB_REPO` de `NEXT_PUBLIC_*`, `GITHUB_TOKEN` opcional
- Tipos: `GithubLabel`, `GithubUser`, `GithubIssue`
- `GithubApiError` class, `githubFetch<T>()` wrapper com rate-limit handling + ISR 1h
- Funcoes: `getGithubUser()`, `getGithubIssues(query?)`, `getGithubIssue(n)`, `getGithubLabels()`
- Exporta `githubConfig`

#### Refatorado: `src/app/page.tsx`
- Async Server Component, `await searchParams`
- `<SearchForm initialPosts initialQuery />` recebe previews pre-renderizados

#### Refatorado: `src/app/posts/[id]/page.tsx`
- Async Server Component
- `generateMetadata({ params })` com OpenGraph + Twitter cards
- `generateStaticParams()` -> primeiros 5 issues quando ha token
- `notFound()` em id invalido ou 404

#### Refatorado: `src/components/search-form.tsx`
- Client Component com `useTransition` + `router.replace('/?q=')`
- Filtro case-insensitive em `title + body + label names`
- URLs de busca compartilhaveis

#### Refatorado: `src/components/blog-profile.tsx`
- Server Component, recebe `user: GithubUser` via prop
- Guards para `bio`/`company` opcionais

#### Refatorado: `src/app/layout.tsx`
- `<GithubContextProvider>` removido
- Metadata rica: `title.template`, openGraph, twitter, authors, keywords, metadataBase

#### Deletado
- `src/context/GithubContext.tsx`, `src/hooks/useGithub.tsx`, `src/lib/axios.ts`
- `axios` do `package.json`

#### Adicionado
- `server-only@0.0.1`

### Como verificar
```bash
pnpm build
# esperado: 50 posts prerenderizados estaticamente (com token), ISR 1h
```

---

## 05 - Syntax Highlighting + GFM

**Data**: 2026-06-06
**Tipo**: Feature

### O que mudou

#### Novo: `src/lib/markdown.ts`
- Pipeline unificado: `remark-parse` + `remark-gfm` + `remark-rehype` + `rehype-pretty-code` + `rehype-stringify`
- `renderMarkdown(md)` para posts (com shiki + `transformerNotationDiff/Highlight`)
- `renderMarkdownPreview(md, max=600)` para previews (sem shiki)
- `server-only` guard

#### Atualizado: `src/app/posts/[id]/page.tsx`
- `<Markdown>` removido, usa `dangerouslySetInnerHTML` de HTML pre-renderizado

#### Atualizado: `src/app/page.tsx`
- `Promise.all(issues.map(...))` para renderizar previews em paralelo
- Novo tipo `PostPreview` com `previewHtml`

#### Atualizado: `src/components/search-form.tsx`
- Consome `PostPreview`, `react-markdown` removido (-1 client bundle kb)

#### Atualizado: `src/app/globals.css`
- `@layer components` block com shiki styles, diff line styles, inline code, etc.

#### Deps adicionados
- `shiki@^4.2.0`, `rehype-pretty-code@^0.14.3`, `@shikijs/transformers@^4.2.0`
- `remark-gfm@^4.0.1`, `unified@^11.0.5`, `remark-parse@^11.0.0`
- `remark-rehype@^11.1.2`

#### Deps removidos
- `react-markdown@^9.1.0`

### Como verificar
1. Abrir `/posts/<id>` (com `.ts`/`.tsx` no body)
2. Verificar bloco de codigo com cores e `data-line`
3. Adicionar `// [!code highlight]` em uma linha -> linha destacada

---

## 06 - CSS: OKLCH + Rate-Limit Fix

**Data**: 2026-06-06
**Tipo**: Fix

### O que mudou

#### Bug 1: `bg-base-background/70` nao compila
- Tailwind 4.3 nao detecta hex em variaveis custom como cor parseavel
- Cores `@theme` convertidas de `#hex` para `oklch(L C H)` (formato moderno, alpha nativo)
- Todas as 16 cores do projeto convertidas: brand, base palette, gladiator (red accent)
- `not-found.module.css`: `bg-base-background/70` -> `bg-black/70` (built-in)

#### Bug 2: Rate limit GitHub em build anonimo
- `getGithubIssues()` paginava ate 10 paginas (ate 1000 issues) + 50 detalhes = 51+ requests
- Anonymous GitHub = 60 req/h, build falhava
- `generateStaticParams` agora retorna `[]` quando `githubConfig.hasToken` e false
- `dynamicParams = true` (default mas agora explicito)
- Os 5 issues so sao pre-renderizados quando ha token; resto e ISR on-demand
- Com `GITHUB_TOKEN` no `.env.local`, ate 5 issues sao SSG; resto ISR

### Por que OKLCH
- E o formato que o Tailwind 4 usa internamente
- Suporta `/X` opacity modifier confiavelmente
- `color-mix(in oklch, var(--color-X) 70%, transparent)` funciona em todos browsers modernos

### Como verificar
```bash
rm -rf .next && pnpm build
# esperado: build sem erros, com ou sem GITHUB_TOKEN
```

---

## 07 - SEO: sitemap + robots + RSS + manifest + JSON-LD

**Data**: 2026-06-06
**Tipo**: Feature

### O que mudou

#### Novo: `src/app/sitemap.ts`
- App Router `MetadataRoute.Sitemap` com `revalidate=1h`
- Lista `/`, `/?ref=feed`, todos os `/posts/[id]` e `/feed.xml`
- Per-post: `lastModified` = `issue.updated_at`, `priority: 0.8`

#### Novo: `src/app/robots.ts`
- `allow /`, `disallow /api/`, `disallow /_next/`
- Aponta para `sitemap.xml`, seta `host`

#### Novo: `src/app/feed.xml/route.ts`
- Server-side RSS 2.0 via `feed` package
- Lista todos os issues como items
- `content` field usa preview HTML pre-renderizado
- `Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400`

#### Novo: `src/lib/site.ts`
- `SITE_CONFIG` centralizado (name, description, author, locale, repo)
- `SITE_URL` de `NEXT_PUBLIC_SITE_URL` com default Vercel

#### Novo: `src/app/manifest.ts`
- PWA manifest: `name`, `short_name`, `display: standalone`
- `theme_color: #3294F8`, `background_color: #071422`
- Icons: `/icon.png` (any), `/apple-icon.png` (maskable 180x180)
- Categorias: developer, technology, education
- Gera `/manifest.webmanifest`

#### Novo: `src/components/json-ld.tsx`
- `ArticleJsonLd`: BlogPosting schema completo
- `WebsiteJsonLd`: WebSite schema com `SearchAction` (sitelinks searchbox)
- `PersonJsonLd`: Person schema para o autor

#### Atualizado: `src/app/layout.tsx`
- `metadata.alternates.types: application/rss+xml -> /feed.xml`
- `metadata.manifest: /manifest.webmanifest`
- `metadata.icons: icon + apple`
- `metadata.appleWebApp: { capable, title, statusBarStyle }`
- `metadata.formatDetection: { telephone: false }`

#### Atualizado: `src/app/posts/[id]/page.tsx`
- `<ArticleJsonLd>` com dados do `post.user`

#### Atualizado: `src/app/page.tsx`
- `<WebsiteJsonLd>` + `<PersonJsonLd>` no `<main>`

#### Deps adicionados
- `feed@^5.2.1`

### Como verificar
```bash
pnpm build
# rotas geradas: /, /_not-found, /feed.xml, /manifest.webmanifest,
#                /posts/[id], /robots.txt, /sitemap.xml
curl http://localhost:3000/robots.txt
curl http://localhost:3000/sitemap.xml | head
curl http://localhost:3000/feed.xml | head
```

---

## 08 - UX: TOC + Reading Time + Label Filter

**Data**: 2026-06-06
**Tipo**: Feature

### O que mudou

#### Novo: `src/types/toc.ts`
- `TocItem` type

#### Deps adicionados
- `rehype-slug@^6.0.0` - injeta `id="slug"` em h1-h6
- `rehype-autolink-headings@^7.1.0` - wrap headings em anchor links
- `github-slugger@^2.0.0` - determinismo de slugs

#### Atualizado: `src/lib/markdown.ts`
- `fullProcessor` com `rehype-slug` + `rehype-autolink-headings`
- `extractToc(md)` retorna `TocItem[]` (apenas h2/h3, respeita code fences)
- `readingTime(md)` retorna `{ words, minutes, text }` (200 wpm, strip code blocks/inline)

#### Atualizado: `src/app/posts/[id]/page.tsx`
- Sticky aside com TOC (so renderiza quando ha 2+ headings)
- Header mostra `Clock icon + 'X min de leitura'`
- Footer com `BookOpen icon + label chips` linkando para `/?label=NAME`

#### Atualizado: `src/app/page.tsx`
- Le `searchParams.label` alem de `q`
- Passa `activeLabel` para `SearchForm`

#### Atualizado: `src/components/search-form.tsx`
- Filtro por label exato primeiro, depois busca case-insensitive
- `allLabels` memo: agrega `label -> count`, sort by count desc
- Chip row com `Tag icon`: toggle filter (`aria-pressed`)
- Active chip: red border + bg + text
- `Limpar` button para resetar ambos `q` e `label`
- Empty state menciona qual filtro produziu zero resultados

#### Atualizado: `src/app/globals.css`
- `.post-body h1-h4 { scroll-margin-top: 5rem }` para anchor links nao colarem no header
- `a.heading-anchor` inherits color, turns red on hover

#### Atualizado: `src/app/posts/[id]/post.module.css`
- `.postToc`, `.postTocItem`, `.postTocSub`, `.postFooter`, `.postFooterLabels`

### Como verificar
1. Abrir `/posts/<id-com-h2-e-h3>`
2. Verificar sidebar TOC com scroll-spy
3. Clicar em uma label chip no footer -> filtra `/`
4. Clicar em "Limpar" no home -> volta para todas as publicacoes

---

## 09 - Engagement: Share + Related Posts

**Data**: 2026-06-06
**Tipo**: Feature

### O que mudou

#### Novo: `src/components/share-buttons.tsx`
- Server Component para X/Twitter, LinkedIn, Reddit
- `CopyLinkButton` (client) com `navigator.clipboard` + feedback "Copiado!"
- `LinkedinLogo` SVG inline (Phosphor nao tem icone LinkedIn)
- Todos com `target="_blank" rel="noopener noreferrer"`

#### Novo: `src/components/related-posts.tsx`
- Server Component que renderiza lista de posts relacionados
- Cada item: title, relative updated_at, comment count, top 3 labels
- Card inteiro e um link; `ArrowRight` icon
- Retorna `null` quando nao ha posts relacionados

#### Novo: `src/lib/github.ts -> getRelatedIssues()`
- Filtra issues que compartilham pelo menos 1 label com o post atual
- Exclui o proprio post
- Retorna ate N resultados (default 3)

#### Atualizado: `src/app/posts/[id]/page.tsx`
- Awaits `getRelatedIssues` no RSC pass
- Renderiza `<ShareButtons/>` e `<RelatedPosts/>` no fim do post

### Como verificar
1. Abrir `/posts/<id-com-labels>`
2. Rolar ate o fim: ver botoes de share + "Posts relacionados" com ate 3 cards

---

## 10 - PWA + BlogProfile reativado

**Data**: 2026-06-06
**Tipo**: Feature

### O que mudou

#### Reativado: BlogProfile no home
- Estava comentado no JSX original
- Usa a variante Server Component da FASE 03, recebe `user` via prop
- Fetch de `getGithubUser()` em paralelo com `getGithubIssues()` no mesmo RSC pass

#### Novo: `src/app/manifest.ts`
- PWA manifest completo (ver FASE 07)
- Adiciona `appleWebApp`, `formatDetection: { telephone: false }` no layout

### Como verificar
```bash
pnpm build
# /manifest.webmanifest aparece na lista de rotas estaticas
curl http://localhost:3000/manifest.webmanifest | jq .
```

---

## 11 - DX: Vitest + Husky + CI

**Data**: 2026-06-06
**Tipo**: DX

### O que mudou

#### Testing: Vitest + Testing Library
- `vitest.config.ts`: happy-dom env, `@` alias, `server-only` aliased to no-op
- `vitest.setup.ts`: jest-dom matchers + auto-cleanup
- `test/server-only-mock.ts`: mock vazio para `server-only`
- `src/lib/markdown.test.ts`: **16 testes** cobrindo renderMarkdown, extractToc, readingTime
- Scripts: `test`, `test:watch`, `test:ui`, `test:coverage`

#### Commit quality: Husky + lint-staged + commitlint
- `.husky/pre-commit`: roda `pnpm exec lint-staged`
- `.husky/commit-msg`: roda `pnpm exec commitlint`
- `commitlint.config.json`: conventional commits (feat/fix/chore/refactor/perf/docs/test/build/ci/style/revert), max 100 chars
- `package.json lint-staged`: `biome check --write` + `vitest related` por arquivo staged

#### CI: GitHub Actions
- `.github/workflows/ci.yml`:
  - Runs on push e PR para `main`
  - Concurrency group cancela runs em paralelo
  - Steps: checkout, pnpm 11, Node 20, install, lint, format-check, typecheck, test, build
  - Build usa `GITHUB_TOKEN` secret
  - Upload de `.next` como artifact em caso de falha

#### Refactors para manter Biome verde
- Remocao de imports/parametros nao usados
- `LinkedinLogo` agora com `role=img` + `aria-label="LinkedIn"`
- `<div role="group">` -> `<fieldset>` em `search-form`
- 4 `biome-ignore lint/security/noDangerouslySetInnerHtml` para usos legitimos
  (markdown HTML renderizado server-side, JSON.stringify JSON-LD)

### Como verificar
```bash
pnpm typecheck && pnpm test && pnpm lint && pnpm build
# esperado: 0 errors em todos, 16/16 testes passam
```

---

## Pendentes (FASES 12-17)

| # | Fase | Descricao | Esforco |
|---|------|-----------|---------|
| 12 | i18n | `next-intl` com traducoes PT-BR/EN, `<html lang>` dinamico | 4h |
| 13 | Giscus | Comentarios GitHub via widget; requer `next-themes` (tema) | 2h |
| 14 | Tema dark/light | `next-themes` + CSS variables com `[data-theme]` selector; refatorar `@theme` para definir `light:` em cada cor | 6h |
| 15 | Sentry | `@sentry/nextjs` com source maps + `tunnelRoute` | 2h |
| 16 | Python helper | Substituir `scripts/post.py` por `tsx scripts/post.ts` ou `node --experimental-strip-types` | 1h |
| 17 | Playwright | E2E para home search, post page, label filter, RSS link | 3h |

---

## 11b - Theme dark/light + Rate-Limit graceful degradation

**Data**: 2026-06-06
**Tipo**: Feature

### O que mudou

#### Rate-limit graceful degradation
- `src/lib/github.ts`: novos `getGithubIssuesSafe()` e `getGithubUserSafe()` que capturam `GithubApiError` e retornam `{ issues, error }` ou `null`
- `src/app/page.tsx`: usa as variantes safe. Quando a API esta rate-limited, renderiza um aviso amigavel em vez de derrubar a arvore React
- `src/components/rate-limit-notice.tsx` (novo): banner com instrucoes para adicionar `GITHUB_TOKEN` no `.env.local`
- `src/app/posts/[id]/page.tsx`: tambem captura `GithubApiError`, loga warning em dev, ainda re-lanca para o ErrorBoundary do Next.js

#### Theme toggle (next-themes)
- `src/components/theme-provider.tsx` (Client): wrappa `NextThemesProvider` com `attribute="data-theme"`, `defaultTheme="dark"`, `enableSystem`
- `src/components/theme-toggle.tsx` (Client): botao Sun/Moon com `useTheme()`; flag `mounted` evita hydration mismatch
- `src/components/theme-toggle.module.css`
- `src/app/layout.tsx`: wrappa body com `ThemeProvider`, adiciona `suppressHydrationWarning` no `<html>`
- `src/app/globals.css`:
  - Bloco `[data-theme='light']` com paleta OKLCH invertida
  - Seletores `[data-theme='dark']` / `[data-theme='light']` para shiki dual theme
  - Transicao de background/color no body (200ms ease)
  - `html { color-scheme: dark light }`
- `src/lib/markdown.ts`: `PRETTY_CODE_OPTIONS` agora usa `{ dark: 'github-dark-dimmed', light: 'github-light' }` (shiki dual)
- `src/app/page.tsx`: `<header>` com `<ThemeToggle/>` no topo
- `src/app/posts/[id]/page.tsx`: `<ThemeToggle/>` no `.postHeaderButtons`

### Como verificar
```bash
rm -rf .next && pnpm build
# esperado: build sem erros, mesmo sem GITHUB_TOKEN (rate-limit nao quebra)
```

---

## 12 - i18n lite (PT-BR/EN)

**Data**: 2026-06-06
**Tipo**: Feature

### O que mudou

#### Novo: `src/lib/i18n.ts`
- `SUPPORTED_LOCALES = ['pt-BR', 'en']`, `DEFAULT_LOCALE = 'pt-BR'`
- Dois dicionarios paralelos (PT-BR, EN) com ~35 chaves cada
- `createTranslator(locale)` retorna `t(key, values?)` com interpolacao
- `resolveLocale(input)`, `isLocale(value)` type guard

#### Novo: `src/components/language-switcher.tsx` (Client)
- Pill group com PT/EN links
- Preserva `q` e `label` ao trocar de idioma via `useSearchParams`

#### Novo: `src/lib/i18n.test.ts`
- 13 testes cobrindo `resolveLocale`, `isLocale`, `createTranslator`

#### Atualizado: `src/app/page.tsx`
- Le `?lang=`, resolve locale, renderiza `<LanguageSwitcher>`

#### Atualizado: `src/components/search-form.tsx`
- Nova prop `locale`, usa `t()` para titulo, count, placeholder, empty state, etc.

### Como verificar
```bash
pnpm test
# esperado: 29/29 (16 markdown + 13 i18n)
```

---

## 13 - Comentarios Giscus

**Data**: 2026-06-06
**Tipo**: Feature

### O que mudou

#### Novo: `src/components/comments.tsx` (Client)
- `@giscus/react` com `mapping='number'` (1 Discussion por post)
- Theme sincronizado com `next-themes` (`light` / `dark_dimmed`)
- Flag `mounted` para evitar hydration mismatch
- Lazy iframe loading

#### Atualizado: `src/app/posts/[id]/page.tsx`
- Renderiza `<Comments>` apos `<RelatedPosts>`

#### Atualizado: `.env.local.example`
- Documenta `NEXT_PUBLIC_GISCUS_REPO_ID`, `NEXT_PUBLIC_GISCUS_CATEGORY`, `NEXT_PUBLIC_GISCUS_CATEGORY_ID`

### Como verificar
1. Habilitar Discussions no GitHub repo
2. Configurar IDs no `.env.local` (https://giscus.app)
3. Abrir `/posts/<id>` e ver widget de comentarios

---

## 14 - Sentry + Observabilidade

**Data**: 2026-06-06
**Tipo**: DX

### O que mudou

#### Novo: Sentry SDK
- `sentry.server.config.ts`, `sentry.client.config.ts`, `instrumentation.ts` (Edge runtime)
- `next.config.mjs`: wrappa config com `withSentryConfig` quando `SENTRY_DSN` setado
- `ignoreErrors`: rate limit, AbortError, NEXT_NOT_FOUND, NEXT_REDIRECT
- `enabled: process.env.NODE_ENV === 'production'` (dev nunca envia)
- `pnpm-workspace.yaml`: `allowBuilds: @sentry/cli: true` (binary download)

#### Atualizado: `.env.local.example`
- Documenta `SENTRY_DSN`, `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN`, `TRACES_SAMPLE_RATE`

### Como verificar
```bash
SENTRY_DSN=https://xxx pnpm build
# esperado: source maps uploadados, sentry-cli binary instalado
```

---

## 15 - Substituir Python helper por script Node

**Data**: 2026-06-06
**Tipo**: DX

### O que mudou

#### Deletado: `bcl__update_outdated_in_reactjs_project.py`
#### Novo: `scripts/update-outdated.mjs` (Node, sem deps)
- Detecta pm via `pnpm-lock.yaml` ou `package-lock.yaml`
- Roda `<pm> outdated` e `<pm> update`
- Se houve atualizacao, faz `git add package.json pnpm-lock.yaml && git commit`

#### Atualizado: `package.json`
- Script: `update:outdated`

### Como verificar
```bash
node scripts/update-outdated.mjs
# ou
pnpm update:outdated
```

---

## 16 - Playwright e2e

**Data**: 2026-06-06
**Tipo**: DX

### O que mudou

#### Novo: `playwright.config.ts`
- Projects: `chromium` (Desktop Chrome) e `mobile-chrome` (Pixel 5)
- `webServer: pnpm dev` com `BASE_URL` override para CI
- Trace + screenshot on failure

#### Novo: `tests/e2e/home.spec.ts` (6 testes)
- Renderiza titulo Dica Dev
- Search input visivel
- Theme toggle flips `data-theme`
- Search atualiza `?q=` na URL
- Label chips renderizam
- 404 retorna 404 status
- SEO endpoints: sitemap, robots, feed, manifest

#### Novo: `tests/e2e/post.spec.ts` (5 testes)
- `/posts/not-a-number` retorna 404
- Pagina 404 tem link Voltar
- Share buttons visiveis
- Reading time label visivel
- JSON-LD `<script>` presente

#### Atualizado: `package.json`
- Scripts: `e2e`, `e2e:ui`, `e2e:install`

#### Atualizado: `.github/workflows/ci.yml`
- Em pull_request: instala Playwright browsers, roda `pnpm e2e`
- Upload de `playwright-report` em caso de falha

### Como verificar
```bash
pnpm e2e:install
pnpm e2e
# esperado: 11 testes passam
```
