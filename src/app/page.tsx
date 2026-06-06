import { SearchForm } from '@/components/search-form'
import { getGithubIssues } from '@/lib/github'

import styles from './home.module.css'

export const revalidate = 3600

type HomePageProps = {
  searchParams: Promise<{ q?: string }>
}

export default async function Home({ searchParams }: HomePageProps) {
  const { q = '' } = await searchParams
  const issues = await getGithubIssues(q)

  return (
    <main className={styles.home}>
      <div className={styles.homeOverLayer} />
      <section className={styles.homeContainer}>
        <h1 className="m-12 text-center text-5xl text-white">Dica Dev</h1>
        <SearchForm initialIssues={issues} initialQuery={q} />
      </section>
    </main>
  )
}
