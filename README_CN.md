# Dica Dev: 技術部落格

![screen](/public/noproject/criandoGIFcomImagens_by_Brenno.gif)

歡迎來到 **Dica-Dev** — 一個為軟體開發者提供建議的技術部落格，內容來自此 GitHub 儲存庫的 issue。每個 issue 變成一篇文章；每個 label 變成分類。

- [Português (Brasil)](/README.md)
- [English (US)](/README_US.md)
- [Italiano](/README_IT.md)
- [Русский](/README_RU.md)

## 技術棧

- **Next.js 16**（App Router、Server Components、ISR 1 小時、文章 SSG）
- **React 19**（預設 Server Components、`use()` API、`useTransition`）
- **TypeScript 5**（strict）
- **Tailwind CSS 4**（CSS-first、`@theme`、OKLCH、雙主題）
- **CSS Modules**（局部作用域樣式）
- **Biome 2**（lint + format，取代 ESLint + Prettier）
- **shiki + unified/remark/rehype**（語法高亮 + GFM，不使用 `react-markdown`）
- **next-themes**（深色/淺色切換，`data-theme` 屬性）
- **@giscus/react**（透過 GitHub Discussions 留言）
- **@sentry/nextjs**（可選的監控，無 DSN 時為 no-op）
- **date-fns 4**（日期格式化）
- **@phosphor-icons/react**（圖示）
- **pnpm 11**（套件管理工具）

## 功能

- **文章 = Issue**：儲存庫的每個 issue 都會成為文章（首頁預覽，完整頁面在 `/posts/[id]`）
- **語法高亮** 使用 shiki（雙主題 github-dark-dimmed / github-light）
- **GitHub Flavored Markdown**：表格、task list、自動連結、標題錨點
- **目錄（TOC）** 黏附於側邊，列出每篇文章的 h2/h3
- **閱讀時間** 估算（200 wpm，忽略程式碼區塊）
- **標籤篩選**（chips）並同步到 URL（`?label=react`）
- **標題/內文搜尋** 並同步到 URL（`?q=hooks`）— 不分大小寫
- **深色/淺色主題** 切換（next-themes，OKLCH）
- **輕量國際化（i18n lite）**：首頁可透過 `?lang=en` 在 PT-BR（預設）與 EN 之間切換
- **分享**：X/Twitter、LinkedIn、Reddit、「複製連結」
- **相關文章** 依據 label 重疊度計算（前三名）
- **留言** 透過 Giscus（每個 issue 編號對應一個 Discussion，主題會同步）
- **API 限流優雅降級**：缺少 GitHub token 時顯示友善橫幅而非當機
- **PWA**：`manifest.webmanifest`、maskable 圖示、`appleWebApp`
- **完整 SEO**：sitemap.xml、robots.txt、`/feed.xml` 的 RSS、JSON-LD（Article、WebSite、含 SearchAction 的 Person）
- **Open Graph + Twitter Cards** 每篇文章（透過 `generateMetadata`）

## 環境需求

- **Node.js 20+**（已在 v24 測試）
- **pnpm 11+** 透過 `corepack enable`（推薦）或 `npm i -g pnpm`

## 如何在本機執行

```bash
git clone https://github.com/brennoclins/dica-dev.git
cd dica-dev
corepack enable
pnpm install
cp .env.local.example .env.local   # 視需要調整
pnpm dev
```

開啟 http://localhost:3000

## 環境變數

請參考儲存庫根目錄的 `.env.local.example`。摘要：

| 變數 | 是否必填 | 說明 |
|---|---|---|
| `NEXT_PUBLIC_GITHUB_USER` | 是 | 儲存庫擁有者（例如 `brennoclins`） |
| `NEXT_PUBLIC_GITHUB_REPO` | 是 | 儲存庫名稱（例如 `dica-dev`） |
| `GITHUB_TOKEN` | 否 | 無需任何 scope 的 PAT；可將 API 限流從 60 提升至 5000 req/h |
| `NEXT_PUBLIC_SITE_URL` | 否 | 正式網址（sitemap、RSS、JSON-LD 使用） |
| `NEXT_PUBLIC_GISCUS_*` | 否 | Giscus ID（https://giscus.app） |
| `SENTRY_*` | 否 | DSN + org + project；未設定時為 no-op |

## 常用指令

| 指令 | 說明 |
|---|---|
| `pnpm dev` | 開發伺服器（HMR） |
| `pnpm build` | 正式版建置（SSG + ISR） |
| `pnpm start` | 在本機執行正式版（用來測試產線行為） |
| `pnpm lint` | Biome lint |
| `pnpm format` | Biome format（會直接寫入） |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm test` | Vitest（29 個測試：markdown + i18n） |
| `pnpm test:watch` | Vitest watch 模式 |
| `pnpm test:coverage` | Vitest 產生覆蓋率報告（v8） |
| `pnpm e2e` | Playwright（11 個測試：home + post） |
| `pnpm e2e:install` | 首次執行下載 Chromium（約 150 MB） |
| `pnpm update:outdated` | 更新過時的相依套件並提交（取代舊的 Python 腳本） |

## 品質 / CI

- **Husky** + **lint-staged**：pre-commit 在被修改的檔案上執行 Biome + Vitest
- **commitlint**：強制 conventional commits（`feat:`、`fix:`、`chore:`…）
- **GitHub Actions**（`.github/workflows/ci.yml`）：每次 push/PR 都跑 lint + format + typecheck + test + build；PR 額外跑 Playwright

## 部署

本專案是標準 **Next.js**，可部署到任何 Node 平台（Vercel 為預設）。在 **Production** 設定環境變數（特別是 `SENTRY_DSN`，若需要監控的話）。建置使用 1 小時 ISR；沒有 `GITHUB_TOKEN` 時，匿名 API 限流（60 req/h）在開發時可能會用完，但正式環境因為快取，實際消耗約只有 3 req/h。

## 貢獻

歡迎貢獻！開一個 issue 分享你的技巧（會自動變成文章），或是送 PR 改進專案。

## 部落格連結

[前往 Dica-Dev](https://dica-dev.vercel.app/)
