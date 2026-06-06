# Dica Dev: Технический блог

![screen](/public/noproject/criandoGIFcomImagens_by_Brenno.gif)

Добро пожаловать в **Dica-Dev** — технический блог с советами для разработчиков, содержимое которого генерируется из issues этого репозитория GitHub. Каждый issue становится статьёй; каждый label — категорией.

- [Português (Brasil)](/README.md)
- [English (US)](/README_US.md)
- [Italiano](/README_IT.md)
- [繁體中文](/README_CN.md)

## Стек

- **Next.js 16** (App Router, Server Components, ISR 1 час, SSG для постов)
- **React 19** (Server Components по умолчанию, `use()` API, `useTransition`)
- **TypeScript 5** (strict)
- **Tailwind CSS 4** (CSS-first, `@theme`, OKLCH, двойная тема)
- **CSS Modules** (локальная область видимости стилей)
- **Biome 2** (lint + format, заменяет ESLint + Prettier)
- **shiki + unified/remark/rehype** (подсветка синтаксиса + GFM, без `react-markdown`)
- **next-themes** (переключатель тёмной/светлой темы, атрибут `data-theme`)
- **@giscus/react** (комментарии через GitHub Discussions)
- **@sentry/nextjs** (опциональная наблюдаемость, no-op без DSN)
- **date-fns 4** (форматирование дат)
- **@phosphor-icons/react** (иконки)
- **pnpm 11** (менеджер пакетов)

## Функции

- **Посты = Issue**: каждый issue становится статьёй (превью на главной, полная страница на `/posts/[id]`)
- **Подсветка синтаксиса** на shiki (двойная тема github-dark-dimmed / github-light)
- **GitHub Flavored Markdown**: таблицы, чек-листы, автоссылки, якоря на заголовках
- **Липкое оглавление (TOC)** с h2/h3 каждого поста
- **Расчётное время чтения** (200 слов/мин, без учёта блоков кода)
- **Фильтр по label** (чипы), состояние в URL (`?label=react`)
- **Поиск по заголовку/тексту**, состояние в URL (`?q=hooks`) — регистронезависимый
- **Тёмная/светлая тема** с переключателем (next-themes, OKLCH)
- **Лёгкая i18n**: PT-BR (по умолчанию) и EN через `?lang=en` на главной
- **Поделиться**: X/Twitter, LinkedIn, Reddit, «Скопировать ссылку»
- **Похожие посты** по пересечению label (топ-3)
- **Комментарии** через Giscus (одна Discussion на номер issue, тема синхронизирована)
- **Плавная деградация при rate-limit**: дружелюбный баннер вместо падения, когда не задан GitHub-токен
- **PWA**: `manifest.webmanifest`, maskable-иконки, `appleWebApp`
- **Полное SEO**: sitemap.xml, robots.txt, RSS по `/feed.xml`, JSON-LD (Article, WebSite, Person с SearchAction)
- **Open Graph + Twitter Cards** для каждого поста (через `generateMetadata`)

## Требования к окружению

- **Node.js 20+** (проверено на v24)
- **pnpm 11+** через `corepack enable` (рекомендуется) или `npm i -g pnpm`

## Как запустить локально

```bash
git clone https://github.com/brennoclins/dica-dev.git
cd dica-dev
corepack enable
pnpm install
cp .env.local.example .env.local   # при необходимости поправьте
pnpm dev
```

Откройте http://localhost:3000

## Переменные окружения

См. `.env.local.example` в корне репозитория. Кратко:

| Переменная | Обязательна? | Описание |
|---|---|---|
| `NEXT_PUBLIC_GITHUB_USER` | да | Владелец репозитория (например, `brennoclins`) |
| `NEXT_PUBLIC_GITHUB_REPO` | да | Имя репозитория (например, `dica-dev`) |
| `GITHUB_TOKEN` | нет | PAT без областей; поднимает лимит с 60 до 5000 req/h |
| `NEXT_PUBLIC_SITE_URL` | нет | Каноничный URL (sitemap, RSS, JSON-LD) |
| `NEXT_PUBLIC_GISCUS_*` | нет | Идентификаторы Giscus (https://giscus.app) |
| `SENTRY_*` | нет | DSN + org + project; без значений — no-op |

## Полезные скрипты

| Скрипт | Что делает |
|---|---|
| `pnpm dev` | Сервер разработки (HMR) |
| `pnpm build` | Прод-сборка (SSG + ISR) |
| `pnpm start` | Запуск собранного приложения локально (тест продакшена) |
| `pnpm lint` | Biome lint |
| `pnpm format` | Biome format (с записью) |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm test` | Vitest (29 тестов: markdown + i18n) |
| `pnpm test:watch` | Vitest в режиме watch |
| `pnpm test:coverage` | Vitest с покрытием (v8) |
| `pnpm e2e` | Playwright (11 тестов: home + post) |
| `pnpm e2e:install` | Скачивает Chromium (~150 МБ) при первом запуске |
| `pnpm update:outdated` | Обновляет устаревшие зависимости и коммитит (заменяет старый Python-скрипт) |

## Качество / CI

- **Husky** + **lint-staged**: pre-commit запускает Biome + Vitest только для изменённых файлов
- **commitlint**: контроль conventional commits (`feat:`, `fix:`, `chore:`…)
- **GitHub Actions** (`.github/workflows/ci.yml`): lint + format + typecheck + test + build на каждый push/PR; на PR дополнительно прогоняется Playwright

## Деплой

Проект на чистом **Next.js** и запускается на любой Node-платформе (по умолчанию Vercel). Задайте переменные окружения в **Production** (особенно `SENTRY_DSN`, если хотите наблюдаемость). Сборка использует ISR 1 час; без `GITHUB_TOKEN` анонимный лимит (60 req/h) может исчерпаться в dev, но в проде кэш снижает реальное потребление до ~3 req/h.

## Вклад

Вклад приветствуется! Откройте issue со своим советом (он автоматически станет постом) или PR с улучшениями.

## Ссылка на блог

[Перейти: Dica-Dev](https://dica-dev.vercel.app/)
