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
| 06 | [SEO: sitemap + robots + RSS + metadata](#06--seo-sitemap--robots--rss--metadata) | Feature | WIP |
| 07 | [UX: Reading time + TOC + share buttons](#07--ux-reading-time--toc--share-buttons) | Feature | Pendente |
| 08 | [Descoberta: filtro por labels + posts relacionados](#08--descoberta-filtro-por-labels--posts-relacionados) | Feature | Pendente |
| 09 | [Tema dark/light (next-themes)](#09--tema-darklight-next-themes) | Feature | Pendente |
| 10 | [Comentarios via Giscus](#10--comentarios-via-giscus) | Feature | Pendente |
| 11 | [PWA manifest](#11--pwa-manifest) | Feature | Pendente |
| 12 | [DX/Infra: testes, husky, CI, scripts](#12--dxinfra-testes-husky-ci-scripts) | DX | Pendente |

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

### Refs
Issues: #1, #2 (estimadas, nao auditadas)

---

## 02 - Migracao pnpm

**Data**: 2026-06-06
**Tipo**: Chore

### O que mudou
- `package.json`: adicionado `packageManager: "pnpm@11.5.2"`, `engines.node >= 20`, `engines.pnpm >= 9`
- `.npmrc` criado com:
  - `auto-install-peers=true` (instala deps peer sem warning)
  - `verify-deps-before-run=false` (nao re-verifica em cada `pnpm dev`)
  - `strict-peer-dependencies=false` (permite resolver conflitos)
- `pnpm-workspace.yaml` criado com:
  - `allowBuilds: { "@biomejs/biome": true, "sharp": true }` (substitui `onlyBuiltDependencies` deprecated do pnpm 10)
- Scripts ajustados:
  - `lint`: `biome lint .`
  - `format`: `biome format --write .`
  - `check`: `biome check --write .`
  - `typecheck`: `tsc --noEmit`
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

| Pacote | De | Para | Notas |
|--------|----|----|-------|
| `@biomejs/biome` | 1.9.4 | 2.4.16 | config v1 -> v2 via `biome migrate --write` |
| `react` | 18.3.1 | 19.2.7 | sem mudancas de codigo |
| `react-dom` | 18.3.1 | 19.2.7 | idem |
| `@types/react` | 18.x | 19.2.16 | idem |
| `@types/react-dom` | 18.x | 19.2.3 | idem |
| `next` | 14.2.35 | 16.2.7 | codemod `next-async-request-api` aplicado |
| `tailwindcss` | 3.4.19 | 4.3.0 | config TS removida; CSS-first via `@theme` |
| `@tailwindcss/postcss` | - | 4.3.0 | novo plugin PostCSS |

### Biome 2 ajustes de config
- `organizeImports` movido para `assist.actions.source.organizeImports`
- `files.ignore` -> `files.includes` com `!` negations
- `css.parser.tailwindDirectives: true` e `css.parser.cssModules: true` ativados
- `css.formatter` e `css.linter` desativados (reativar em fase futura; CSS com `@apply` multi-linha causa falso positivo)
- Excluidos `*.css` e `next-env.d.ts` do `includes`

### Next 16 + React 19 ajustes
- `tsconfig.json` auto-atualizado: `jsx: "react-jsx"`, `target: "ES2017"`, adicionado `.next/dev/types/**/*.ts` ao `include`
- `posts/[id]/page.tsx` migrado para `props: { params: Promise<{ id: string }> }` com `use(props.params)` (via codemod)

### Tailwind 4 ajustes
- `tailwind.config.ts` deletado
- `src/app/globals.css` reescrito:
  - `@import "tailwindcss"`
  - Bloco `@theme` com todas as cores customizadas (`--color-blue`, `--color-base-*`, `--color-*-gladiator`, `--color-link-active`) + gradientes
  - `@layer base` com reset
- `postcss.config.mjs` usa apenas `'@tailwindcss/postcss'`
- Todos os 5 arquivos `*.module.css` ganharam `@reference "<path-to-globals>"` (paths: `./globals.css` para `src/app/*`, `../../globals.css` para `src/app/posts/[id]`, `../app/globals.css` para `src/components/*`)

### Como verificar
```bash
pnpm typecheck    # tsc --noEmit
pnpm check        # biome
pnpm build        # next build
# esperado: 50 posts SSG, 0 errors
```

---

## 04 - Refatoracao para Server Components

**Data**: 2026-06-06
**Tipo**: Refactor

### O que mudou

#### Novo: `src/lib/github.ts`
Camada server-only de acesso a API do GitHub:
- `import 'server-only'` (falha no build se importado de Client Component)
- `GITHUB_USER`/`GITHUB_REPO` lidos de `NEXT_PUBLIC_*` (com fallback)
- `GITHUB_TOKEN` opcional (60 -> 5000 req/h)
- Tipos: `GithubLabel`, `GithubUser`, `GithubIssue`
- `GithubApiError` com `status` + endpoint context
- `githubFetch<T>()` wrapper com:
  - `next: { revalidate: 3600 }` (ISR 1h)
  - Tratamento de rate-limit (403 + `x-ratelimit-remaining=0`) com hint
  - 404, 401, 5xx separados
- Funcoes publicas:
  - `getGithubUser()` -> usuario autenticado
  - `getGithubIssues(query?, user?, repo?)` -> ate 10 paginas, perPage=100
  - `getGithubIssue(number)` -> issue individual
  - `getGithubLabels()` -> labels do repo
- Exporta `githubConfig` (`{ user, repo, hasToken }`)

#### Refatorado: `src/app/page.tsx`
- Async Server Component (sem `'use client'`)
- `const { q = '' } = await searchParams` (filtro server-side)
- `<SearchForm initialPosts initialQuery />` recebe previews pre-renderizados

#### Refatorado: `src/app/posts/[id]/page.tsx`
- Async Server Component
- `generateMetadata({ params })` retorna OpenGraph + Twitter cards
- `generateStaticParams()` -> primeiros 50 issues -> **50 paginas SSG** no build
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
- `src/context/GithubContext.tsx`
- `src/hooks/useGithub.tsx`
- `src/lib/axios.ts`
- `axios` do `package.json`

#### Adicionado
- `server-only@0.0.1`

### Como verificar
```bash
pnpm build
# esperado: 50 posts prerenderizados estaticamente, ISR 1h
```

---

## 05 - Syntax Highlighting + GFM

**Data**: 2026-06-06
**Tipo**: Feature

### O que mudou

#### Novo: `src/lib/markdown.ts`
Pipeline unificado para renderizar markdown no servidor:
- `unified()` + `remark-parse` + `remark-gfm` + `remark-rehype` + `rehype-pretty-code` + `rehype-stringify`
- Dois processadores:
  - `renderMarkdown(md)` para posts completos (com shiki + transformers)
  - `renderMarkdownPreview(md, max=600)` para previews (sem shiki, mais leve)
- Shiki configurado:
  - Tema: `github-dark-dimmed` (scaffolding para dual theme)
  - `transformerNotationDiff()` -> `// [!code ++]` / `// [!code --]`
  - `transformerNotationHighlight()` -> `// [!code highlight]`

#### Atualizado: `src/app/posts/[id]/page.tsx`
- `<Markdown>` removido
- `const bodyHtml = await renderMarkdown(post.body ?? '')`
- `dangerouslySetInnerHTML={{ __html: bodyHtml }}`

#### Atualizado: `src/app/page.tsx`
- `Promise.all(issues.map(...))` para renderizar todos os previews em paralelo
- Novo tipo `PostPreview` com campo `previewHtml: string`

#### Atualizado: `src/components/search-form.tsx`
- Consome `PostPreview` (sem `body` cru)
- `dangerouslySetInnerHTML` do `previewHtml`
- `react-markdown` removido do client bundle (-1 dep)

#### Atualizado: `src/app/globals.css`
Bloco `@layer components` com:
- `.post-body figure[data-rehype-pretty-code-figure]` -> borda + rounded
- `[data-rehype-pretty-code-title]` -> header com label da linguagem
- `pre[data-language]` -> `overflow-x-auto`, shiki bg
- `[data-line]` -> `block`, border-left, padding
- `[data-highlighted-line]` -> border-left red + bg red/10
- `[data-highlighted-chars]` -> bg red/20
- `[data-line].diff.add` / `.diff.remove` -> emerald / red
- `:not(pre) > code` -> inline code styled

#### Atualizado: `src/app/posts/[id]/post.module.css`
- `pre` sem padding (shiki controla)
- `code` -> `font-mono text-sm`
- Estilos para `a`, `blockquote`, `table`, `th`, `td`, `h1-h3`

#### Deps adicionados
- `shiki@^4.2.0`
- `rehype-pretty-code@^0.14.3`
- `@shikijs/transformers@^4.2.0`
- `remark-gfm@^4.0.1`
- `unified@^11.0.5`
- `remark-parse@^11.0.0`
- `remark-rehype@^11.1.2`
- `rehype-stringify@^10.0.0` (transitivo)

#### Deps removidos
- `react-markdown@^9.1.0`

### Como verificar
1. Abrir `http://localhost:3000/posts/<qualquer-id>` (com `.ts`, `.tsx`, `.tsx` no body)
2. Verificar bloco de codigo com cores e numeros de linha
3. Adicionar `// [!code highlight]` em uma linha e rebuild -> linha destacada

### Refs
Phase 4.1
