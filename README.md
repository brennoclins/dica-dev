# Dica Dev: Blog Tech

![screen](/public/noproject/criandoGIFcomImagens_by_Brenno.gif)

Bem-vindo ao **Dica-Dev**! Um blog tech com dicas para desenvolvedores, gerado a partir das issues deste repositório GitHub. Cada issue vira um post; cada label vira categoria.

- [English (US)](/README_US.md)
- [Italiano](/README_IT.md)
- [繁體中文](/README_CN.md)
- [Русский](/README_RU.md)

## Stack

- **Next.js 16** (App Router, Server Components, ISR 1h, SSG para posts)
- **React 19** (Server Components por padrão, `use()` API, `useTransition`)
- **TypeScript 5** (strict)
- **Tailwind CSS 4** (CSS-first, `@theme`, OKLCH, dual theme)
- **CSS Modules** (componentes com escopo local)
- **Biome 2** (lint + format, substitui ESLint + Prettier)
- **shiki + unified/remark/rehype** (syntax highlight + GFM, sem `react-markdown`)
- **next-themes** (toggle dark/light, `data-theme` attribute)
- **@giscus/react** (comentários via GitHub Discussions)
- **@sentry/nextjs** (observabilidade opcional, no-op sem DSN)
- **date-fns 4** (formatação de datas em PT-BR)
- **@phosphor-icons/react** (ícones)
- **pnpm 11** (package manager)

## Funcionalidades

- **Posts = Issues**: cada issue do repositório vira artigo (preview na home, página completa em `/posts/[id]`)
- **Syntax highlighting** com shiki (dual theme github-dark-dimmed / github-light)
- **GitHub Flavored Markdown**: tabelas, task lists, autolinks, anchor links nos headings
- **Tabela de Conteúdos (TOC)** sticky com h2/h3 de cada post
- **Tempo de leitura** estimado (200 wpm, ignora blocos de código)
- **Filtro por label** (chips) com URL state (`?label=react`)
- **Busca por título/corpo** com URL state (`?q=hooks`) — case-insensitive
- **Theme dark/light** com toggle (next-themes, OKLCH)
- **i18n lite**: PT-BR (default) e EN via `?lang=en` na home
- **Compartilhamento**: X/Twitter, LinkedIn, Reddit, "Copiar link"
- **Posts relacionados** baseados em overlap de labels (top 3)
- **Comentários** via Giscus (1 Discussion por número de issue, tema sincronizado)
- **Rate-limit graceful**: aviso amigável em vez de tela de erro quando o token não está setado
- **PWA**: `manifest.webmanifest`, ícones maskable, `appleWebApp`
- **SEO completo**: sitemap.xml, robots.txt, RSS em `/feed.xml`, JSON-LD (Article, WebSite, Person com SearchAction)
- **Open Graph + Twitter Cards** por post (via `generateMetadata`)

## Pré-requisitos

- **Node.js 20+** (testado em v24)
- **pnpm 11+** via `corepack enable` (recomendado) ou `npm i -g pnpm`

## Como executar

```bash
git clone https://github.com/brennoclins/dica-dev.git
cd dica-dev
corepack enable
pnpm install
cp .env.local.example .env.local   # ajuste se necessário
pnpm dev
```

Acesse http://localhost:3000

## Variáveis de ambiente

Veja o arquivo `.env.local.example` na raiz. Resumo:

| Var | Obrigatório? | Descrição |
|---|---|---|
| `NEXT_PUBLIC_GITHUB_USER` | sim | Dono do repo (ex: `brennoclins`) |
| `NEXT_PUBLIC_GITHUB_REPO` | sim | Nome do repo (ex: `dica-dev`) |
| `GITHUB_TOKEN` | não | PAT sem escopo; sobe rate-limit de 60 para 5000 req/h |
| `NEXT_PUBLIC_SITE_URL` | não | URL canônica (sitemap, RSS, JSON-LD) |
| `NEXT_PUBLIC_GISCUS_*` | não | IDs do Giscus (https://giscus.app) |
| `SENTRY_*` | não | DSN + org + project; no-op se vazio |

## Scripts úteis

| Script | O que faz |
|---|---|
| `pnpm dev` | Servidor de desenvolvimento (HMR) |
| `pnpm build` | Build de produção (SSG + ISR) |
| `pnpm start` | Serve o build localmente (testa prod) |
| `pnpm lint` | Biome lint |
| `pnpm format` | Biome format (write) |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm test` | Vitest (29 testes: markdown + i18n) |
| `pnpm test:watch` | Vitest em watch mode |
| `pnpm test:coverage` | Vitest com coverage (v8) |
| `pnpm e2e` | Playwright (11 testes: home + post) |
| `pnpm e2e:install` | Baixa Chromium (~150 MB) na primeira vez |
| `pnpm update:outdated` | Atualiza deps outdated e commita (substitui o script Python antigo) |

## Qualidade / CI

- **Husky** + **lint-staged**: pre-commit roda Biome + Vitest nos arquivos modificados
- **commitlint**: enforce de conventional commits (`feat:`, `fix:`, `chore:`…)
- **GitHub Actions** (`.github/workflows/ci.yml`): lint + format + typecheck + test + build em todo push/PR; Playwright roda em PRs

## Deploy

O projeto é **Next.js** e roda em qualquer plataforma Node (Vercel é o default). Configure as env vars em **Production** (especialmente `SENTRY_DSN` se quiser observabilidade). O build usa ISR 1h; sem `GITHUB_TOKEN` o rate-limit anônimo (60 req/h) pode esgotar em dev, mas em produção o cache reduz o consumo a ~3 req/h.

## Contribuição

Contribuições são bem-vindas! Abra uma issue com sua dica (ela vira post automaticamente) ou um PR com melhorias.

## Link do blog

[Acesse: Dica-Dev](https://dica-dev.vercel.app/)
