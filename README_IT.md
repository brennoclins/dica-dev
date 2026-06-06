# Dica Dev: Blog Tech

![screen](/public/noproject/criandoGIFcomImagens_by_Brenno.gif)

Benvenuto su **Dica-Dev** — un blog tecnico con consigli per sviluppatori, generato dalle issue di questo repository GitHub. Ogni issue diventa un articolo; ogni label diventa una categoria.

- [Português (Brasil)](/README.md)
- [English (US)](/README_US.md)
- [繁體中文](/README_CN.md)
- [Русский](/README_RU.md)

## Stack

- **Next.js 16** (App Router, Server Components, ISR 1h, SSG per i post)
- **React 19** (Server Components di default, `use()` API, `useTransition`)
- **TypeScript 5** (strict)
- **Tailwind CSS 4** (CSS-first, `@theme`, OKLCH, doppio tema)
- **CSS Modules** (stili con scope locale)
- **Biome 2** (lint + format, sostituisce ESLint + Prettier)
- **shiki + unified/remark/rehype** (syntax highlight + GFM, niente `react-markdown`)
- **next-themes** (toggle dark/light, attributo `data-theme`)
- **@giscus/react** (commenti via GitHub Discussions)
- **@sentry/nextjs** (osservabilità opzionale, no-op senza DSN)
- **date-fns 4** (formattazione date)
- **@phosphor-icons/react** (icone)
- **pnpm 11** (package manager)

## Funzionalità

- **Post = Issue**: ogni issue del repo diventa un articolo (anteprima in home, pagina completa in `/posts/[id]`)
- **Syntax highlighting** con shiki (doppio tema github-dark-dimmed / github-light)
- **GitHub Flavored Markdown**: tabelle, task list, autolink, ancore sugli heading
- **Indice (TOC)** sticky con h2/h3 di ogni post
- **Tempo di lettura** stimato (200 wpm, ignora i blocchi di codice)
- **Filtro per label** (chips) con stato in URL (`?label=react`)
- **Ricerca per titolo/corpo** con stato in URL (`?q=hooks`) — case-insensitive
- **Tema dark/light** con toggle (next-themes, OKLCH)
- **i18n lite**: PT-BR (default) e EN tramite `?lang=en` sulla home
- **Condivisione**: X/Twitter, LinkedIn, Reddit, "Copia link"
- **Post correlati** basati sulla sovrapposizione di label (top 3)
- **Commenti** via Giscus (una Discussion per numero di issue, tema sincronizzato)
- **Rate-limit graduale**: banner amichevole invece di crash quando manca il token GitHub
- **PWA**: `manifest.webmanifest`, icone maskable, `appleWebApp`
- **SEO completo**: sitemap.xml, robots.txt, RSS in `/feed.xml`, JSON-LD (Article, WebSite, Person con SearchAction)
- **Open Graph + Twitter Cards** per post (via `generateMetadata`)

## Prerequisiti

- **Node.js 20+** (testato su v24)
- **pnpm 11+** via `corepack enable` (consigliato) oppure `npm i -g pnpm`

## Come eseguire

```bash
git clone https://github.com/brennoclins/dica-dev.git
cd dica-dev
corepack enable
pnpm install
cp .env.local.example .env.local   # modifica se necessario
pnpm dev
```

Apri http://localhost:3000

## Variabili d'ambiente

Vedi `.env.local.example` nella root del repo. Riepilogo:

| Var | Obbligatoria? | Descrizione |
|---|---|---|
| `NEXT_PUBLIC_GITHUB_USER` | sì | Proprietario del repo (es. `brennoclins`) |
| `NEXT_PUBLIC_GITHUB_REPO` | sì | Nome del repo (es. `dica-dev`) |
| `GITHUB_TOKEN` | no | PAT senza scope; alza il rate-limit da 60 a 5000 req/h |
| `NEXT_PUBLIC_SITE_URL` | no | URL canonico (sitemap, RSS, JSON-LD) |
| `NEXT_PUBLIC_GISCUS_*` | no | ID Giscus (https://giscus.app) |
| `SENTRY_*` | no | DSN + org + project; no-op se vuoti |

## Script

| Script | Cosa fa |
|---|---|
| `pnpm dev` | Server di sviluppo (HMR) |
| `pnpm build` | Build di produzione (SSG + ISR) |
| `pnpm start` | Serve il build in locale (testa la produzione) |
| `pnpm lint` | Biome lint |
| `pnpm format` | Biome format (write) |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm test` | Vitest (29 test: markdown + i18n) |
| `pnpm test:watch` | Vitest in watch mode |
| `pnpm test:coverage` | Vitest con coverage (v8) |
| `pnpm e2e` | Playwright (11 test: home + post) |
| `pnpm e2e:install` | Scarica Chromium (~150 MB) la prima volta |
| `pnpm update:outdated` | Aggiorna le dipendenze outdated e fa commit (sostituisce il vecchio script Python) |

## Qualità / CI

- **Husky** + **lint-staged**: pre-commit esegue Biome + Vitest sui file modificati
- **commitlint**: enforce dei conventional commits (`feat:`, `fix:`, `chore:`…)
- **GitHub Actions** (`.github/workflows/ci.yml`): lint + format + typecheck + test + build su ogni push/PR; Playwright gira sulle PR

## Deploy

Il progetto è **Next.js** "puro" e gira su qualsiasi piattaforma Node (Vercel è il default). Configura le env vars in **Production** (in particolare `SENTRY_DSN` se vuoi l'osservabilità). Il build usa ISR a 1h; senza `GITHUB_TOKEN` il rate-limit anonimo (60 req/h) può esaurirsi in dev, ma in produzione la cache riduce il consumo reale a ~3 req/h.

## Contributi

I contributi sono benvenuti! Apri una issue con il tuo consiglio (diventa un post in automatico) o una PR con miglioramenti.

## Link del blog

[Apri: Dica-Dev](https://dica-dev.vercel.app/)
