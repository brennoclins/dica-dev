# Dica Dev: Tech Blog

![screen](/public/noproject/criandoGIFcomImagens_by_Brenno.gif)

Welcome to **Dica-Dev** — a tech blog with tips for software developers, generated from this GitHub repository's issues. Every issue becomes a post; every label becomes a category.

- [Português (Brasil)](/README.md)
- [Italiano](/README_IT.md)
- [繁體中文](/README_CN.md)
- [Русский](/README_RU.md)

## Stack

- **Next.js 16** (App Router, Server Components, ISR 1h, SSG for posts)
- **React 19** (Server Components by default, `use()` API, `useTransition`)
- **TypeScript 5** (strict)
- **Tailwind CSS 4** (CSS-first, `@theme`, OKLCH, dual theme)
- **CSS Modules** (locally scoped styles)
- **Biome 2** (lint + format, replaces ESLint + Prettier)
- **shiki + unified/remark/rehype** (syntax highlight + GFM, no `react-markdown`)
- **next-themes** (dark/light toggle, `data-theme` attribute)
- **@giscus/react** (comments via GitHub Discussions)
- **@sentry/nextjs** (optional observability, no-op without DSN)
- **date-fns 4** (date formatting)
- **@phosphor-icons/react** (icons)
- **pnpm 11** (package manager)

## Features

- **Posts = Issues**: each repo issue becomes an article (preview on home, full page at `/posts/[id]`)
- **Syntax highlighting** with shiki (dual theme github-dark-dimmed / github-light)
- **GitHub Flavored Markdown**: tables, task lists, autolinks, anchor links on headings
- **Sticky Table of Contents (TOC)** with h2/h3 of each post
- **Reading time** estimate (200 wpm, ignores code blocks)
- **Label filter** (chips) with URL state (`?label=react`)
- **Title/body search** with URL state (`?q=hooks`) — case-insensitive
- **Dark/light theme** toggle (next-themes, OKLCH)
- **i18n lite**: PT-BR (default) and EN via `?lang=en` on the home page
- **Sharing**: X/Twitter, LinkedIn, Reddit, "Copy link"
- **Related posts** based on label overlap (top 3)
- **Comments** via Giscus (one Discussion per issue number, theme-synced)
- **Graceful rate-limit**: friendly banner instead of a crash when the GitHub token is missing
- **PWA**: `manifest.webmanifest`, maskable icons, `appleWebApp`
- **Full SEO**: sitemap.xml, robots.txt, RSS at `/feed.xml`, JSON-LD (Article, WebSite, Person with SearchAction)
- **Open Graph + Twitter Cards** per post (via `generateMetadata`)

## Prerequisites

- **Node.js 20+** (tested on v24)
- **pnpm 11+** via `corepack enable` (recommended) or `npm i -g pnpm`

## Running locally

```bash
git clone https://github.com/brennoclins/dica-dev.git
cd dica-dev
corepack enable
pnpm install
cp .env.local.example .env.local   # tweak as needed
pnpm dev
```

Open http://localhost:3000

## Environment variables

See `.env.local.example` at the repo root. Summary:

| Var | Required? | Description |
|---|---|---|
| `NEXT_PUBLIC_GITHUB_USER` | yes | Repo owner (e.g. `brennoclins`) |
| `NEXT_PUBLIC_GITHUB_REPO` | yes | Repo name (e.g. `dica-dev`) |
| `GITHUB_TOKEN` | no | PAT without scopes; raises rate limit from 60 to 5000 req/h |
| `NEXT_PUBLIC_SITE_URL` | no | Canonical URL (sitemap, RSS, JSON-LD) |
| `NEXT_PUBLIC_GISCUS_*` | no | Giscus IDs (https://giscus.app) |
| `SENTRY_*` | no | DSN + org + project; no-op when empty |

## Scripts

| Script | What it does |
|---|---|
| `pnpm dev` | Dev server (HMR) |
| `pnpm build` | Production build (SSG + ISR) |
| `pnpm start` | Serve the build locally (tests production) |
| `pnpm lint` | Biome lint |
| `pnpm format` | Biome format (write) |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm test` | Vitest (29 tests: markdown + i18n) |
| `pnpm test:watch` | Vitest in watch mode |
| `pnpm test:coverage` | Vitest with coverage (v8) |
| `pnpm e2e` | Playwright (11 tests: home + post) |
| `pnpm e2e:install` | Download Chromium (~150 MB) the first time |
| `pnpm update:outdated` | Update outdated deps and commit (replaces the old Python helper) |

## Quality / CI

- **Husky** + **lint-staged**: pre-commit runs Biome + Vitest on modified files
- **commitlint**: conventional-commits enforcement (`feat:`, `fix:`, `chore:`…)
- **GitHub Actions** (`.github/workflows/ci.yml`): lint + format + typecheck + test + build on every push/PR; Playwright runs on PRs

## Deployment

The project is plain **Next.js** and runs on any Node platform (Vercel is the default). Set the env vars in **Production** (especially `SENTRY_DSN` if you want observability). The build uses 1h ISR; without `GITHUB_TOKEN` the anonymous rate limit (60 req/h) can deplete during dev, but in production the cache drops real consumption to ~3 req/h.

## Contributing

Contributions are welcome! Open an issue with your tip (it becomes a post automatically) or a PR with improvements.

## Blog link

[Open: Dica-Dev](https://dica-dev.vercel.app/)
