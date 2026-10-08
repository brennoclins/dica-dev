import { BlogProfile } from '@/components/blog-profile'
import { PersonJsonLd, WebsiteJsonLd } from '@/components/json-ld'
import { LanguageSwitcher } from '@/components/language-switcher'
import type { PostCardData } from '@/components/post-card'
import { PostsFeed } from '@/components/posts-feed'
import { RateLimitNotice } from '@/components/rate-limit-notice'
import { SearchForm } from '@/components/search-form'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  GithubApiError,
  getGithubIssuesPage,
  getGithubLabels,
  getGithubUserSafe,
  githubConfig,
} from '@/lib/github'
import { createTranslator, resolveLocale } from '@/lib/i18n'
import { renderMarkdownPreview } from '@/lib/markdown'
import { SITE_CONFIG } from '@/lib/site'

import styles from './home.module.css'

export const revalidate = 3600

const POSTS_PER_PAGE = 10
const PREVIEW_LENGTH = 600

type HomePageProps = {
  searchParams: Promise<{ q?: string; label?: string; lang?: string }>
}

export default async function Home({ searchParams }: HomePageProps) {
  const { q = '', label = '', lang } = await searchParams
  const locale = resolveLocale(lang)
  const t = createTranslator(locale)

  const combinedQuery = [q.trim(), label ? `label:"${label}"` : '']
    .filter(Boolean)
    .join(' ')

  const [issuesResult, user, labels] = await Promise.all([
    getGithubIssuesPage(1, POSTS_PER_PAGE, combinedQuery)
      .then(result => ({ result, error: null as GithubApiError | null }))
      .catch(err => {
        if (err instanceof GithubApiError) {
          return {
            result: { items: [], total_count: 0, hasMore: false },
            error: err,
          }
        }
        throw err
      }),
    getGithubUserSafe(),
    getGithubLabels().catch(() => []),
  ])

  const safeIssues = issuesResult.result.items

  const initialPosts: PostCardData[] = await Promise.all(
    safeIssues.slice(0, POSTS_PER_PAGE).map(async issue => ({
      number: issue.number,
      title: issue.title,
      updated_at: issue.updated_at,
      labels: issue.labels,
      previewHtml: await renderMarkdownPreview(
        issue.body ?? '',
        PREVIEW_LENGTH
      ),
    }))
  )

  return (
    <>
      {user && (
        <WebsiteJsonLd
          authorName={SITE_CONFIG.author}
          authorUrl={`https://github.com/${githubConfig.user}`}
        />
      )}
      {user && (
        <PersonJsonLd
          name={user.name ?? user.login}
          bio={user.bio ?? ''}
          avatarUrl={user.avatar_url}
          githubUrl={user.html_url}
        />
      )}

      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <header className={styles.heroHeader}>
          <div className="flex items-center gap-2">
            <LanguageSwitcher current={locale} />
            <ThemeToggle />
          </div>
        </header>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>{t('home.heading')}</h1>
          {user && <BlogProfile user={user} />}
          <SearchForm
            labels={labels}
            initialQuery={q}
            activeLabel={label}
            locale={locale}
          />
        </div>
        <div className={styles.heroFade} />
      </section>

      {issuesResult.error ? (
        <section className={styles.feed}>
          <RateLimitNotice error={issuesResult.error} />
        </section>
      ) : (
        <PostsFeed
          key={`${q}:${label}`}
          initialPosts={initialPosts}
          initialHasMore={issuesResult.result.hasMore}
          initialTotalCount={issuesResult.result.total_count}
          perPage={POSTS_PER_PAGE}
          query={q}
          label={label}
          locale={locale}
        />
      )}
    </>
  )
}
