'use client'

import { format, formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  type FormEvent,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from 'react'

import type { GithubLabel } from '@/lib/github'

import styles from './search-form.module.css'

export type PostPreview = {
  number: number
  title: string
  updated_at: string
  labels: GithubLabel[]
  previewHtml: string
}

type SearchFormProps = {
  initialPosts: PostPreview[]
  initialQuery?: string
}

function matches(post: PostPreview, query: string): boolean {
  if (!query) return true
  const lower = query.toLowerCase()
  return (
    post.title.toLowerCase().includes(lower) ||
    post.previewHtml.toLowerCase().includes(lower) ||
    post.labels.some(l => l.name.toLowerCase().includes(lower))
  )
}

export function SearchForm({
  initialPosts,
  initialQuery = '',
}: SearchFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [searchText, setSearchText] = useState<string>(initialQuery)

  useEffect(() => {
    setSearchText(searchParams.get('q') ?? '')
  }, [searchParams])

  const filteredPosts = useMemo(
    () => initialPosts.filter(p => matches(p, searchText.trim().toLowerCase())),
    [initialPosts, searchText]
  )

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString())
      const trimmed = searchText.trim()
      if (trimmed) params.set('q', trimmed)
      else params.delete('q')
      router.replace(`/?${params.toString()}`, { scroll: false })
    })
  }

  return (
    <section className={styles.searchForm}>
      <section className={styles.searchFormContainer}>
        <form onSubmit={handleSubmit}>
          <div className={styles.searchFormHeader}>
            <h2 className={styles.searchFormTitle}>Publicações</h2>
            <span className={styles.searchFormSubTitle}>
              {`${filteredPosts.length} ${
                filteredPosts.length === 1 ? 'Publicação' : 'Publicações'
              }`}
            </span>
          </div>

          <input
            className={styles.searchFormInput}
            type="search"
            placeholder="Buscar por título, conteúdo ou label..."
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            aria-label="Buscar publicações"
          />
        </form>
      </section>

      <section
        className={styles.postCardConainer}
        aria-busy={isPending}
        aria-live="polite"
      >
        {filteredPosts.length === 0 ? (
          <p className="col-span-full p-8 text-center text-base-span">
            Nenhuma publicação encontrada para "{searchText}".
          </p>
        ) : (
          filteredPosts.map(post => {
            const updatedAt = new Date(post.updated_at)
            const updatedAtFormatted = format(
              updatedAt,
              "d 'de' LLLL 'ás' HH:mm'h'",
              { locale: ptBR }
            )
            const updatedAtRelative = formatDistanceToNow(updatedAt, {
              locale: ptBR,
              addSuffix: true,
            })

            return (
              <article key={post.number} className={styles.postCard}>
                <div>
                  <header className={styles.postCardHeader}>
                    <h4 className={styles.postCardTitle}>{post.title}</h4>
                    <span className={styles.postCardDate}>
                      <time
                        title={updatedAtFormatted}
                        dateTime={post.updated_at}
                      >
                        {updatedAtRelative}
                      </time>
                    </span>
                  </header>

                  <div
                    className={styles.postCardPreview}
                    dangerouslySetInnerHTML={{ __html: post.previewHtml }}
                  />
                </div>

                <footer>
                  <Link
                    className={styles.postCardLink}
                    href={`/posts/${post.number}`}
                  >
                    Click e leia mais...
                  </Link>
                </footer>
              </article>
            )
          })
        )}
      </section>
    </section>
  )
}
