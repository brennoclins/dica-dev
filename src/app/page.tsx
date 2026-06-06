import { BlogProfile } from '@/components/blog-profile'
import { PersonJsonLd, WebsiteJsonLd } from '@/components/json-ld'
import { RateLimitNotice } from '@/components/rate-limit-notice'
import { type PostPreview, SearchForm } from '@/components/search-form'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  getGithubIssuesSafe,
  getGithubUserSafe,
  githubConfig,
} from '@/lib/github'
import { renderMarkdownPreview } from '@/lib/markdown'
import { SITE_CONFIG } from '@/lib/site'

import styles from './home.module.css'

export const revalidate = 3600

type HomePageProps = {
  searchParams: Promise<{ q?: string; label?: string }>
}

export default async function Home({ searchParams }: HomePageProps) {
  const { q = '', label = '' } = await searchParams
  const [issuesResult, user] = await Promise.all([
    getGithubIssuesSafe(q),
    getGithubUserSafe(),
  ])

  const posts: PostPreview[] = issuesResult.error
    ? []
    : await Promise.all(
        issuesResult.issues.map(async issue => ({
          number: issue.number,
          title: issue.title,
          updated_at: issue.updated_at,
          labels: issue.labels,
          previewHtml: await renderMarkdownPreview(issue.body ?? '', 600),
        }))
      )

  return (
    <main className={styles.home}>
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
      <div className={styles.homeOverLayer} />
      <header className={styles.homeHeader}>
        <span />
        <ThemeToggle />
      </header>
      <section className={styles.homeContainer}>
        <h1 className="m-12 text-center text-5xl text-base-title">Dica Dev</h1>
        {user && <BlogProfile user={user} />}
        {issuesResult.error && <RateLimitNotice error={issuesResult.error} />}
        <SearchForm initialPosts={posts} initialQuery={q} activeLabel={label} />
      </section>
    </main>
  )
}
