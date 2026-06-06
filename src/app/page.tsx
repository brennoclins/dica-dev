import { WebsiteJsonLd } from '@/components/json-ld'
import { type PostPreview, SearchForm } from '@/components/search-form'
import { getGithubIssues, githubConfig } from '@/lib/github'
import { renderMarkdownPreview } from '@/lib/markdown'
import { SITE_CONFIG } from '@/lib/site'

import styles from './home.module.css'

export const revalidate = 3600

type HomePageProps = {
  searchParams: Promise<{ q?: string; label?: string }>
}

export default async function Home({ searchParams }: HomePageProps) {
  const { q = '', label = '' } = await searchParams
  const issues = await getGithubIssues(q)

  const posts: PostPreview[] = await Promise.all(
    issues.map(async issue => ({
      number: issue.number,
      title: issue.title,
      updated_at: issue.updated_at,
      labels: issue.labels,
      previewHtml: await renderMarkdownPreview(issue.body ?? '', 600),
    }))
  )

  return (
    <main className={styles.home}>
      <WebsiteJsonLd
        authorName={SITE_CONFIG.author}
        authorUrl={`https://github.com/${githubConfig.user}`}
      />
      <div className={styles.homeOverLayer} />
      <section className={styles.homeContainer}>
        <h1 className="m-12 text-center text-5xl text-white">Dica Dev</h1>
        <SearchForm initialPosts={posts} initialQuery={q} activeLabel={label} />
      </section>
    </main>
  )
}
