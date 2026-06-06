'use client'

import { ArrowSquareOut, Tag, X } from '@phosphor-icons/react/dist/ssr'
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
import { createTranslator, type Locale } from '@/lib/i18n'

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
  activeLabel?: string
  locale?: Locale
}

function matches(post: PostPreview, query: string, label: string): boolean {
  if (label && !post.labels.some(l => l.name === label)) {
    return false
  }
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
  activeLabel = '',
  locale = 'pt-BR',
}: SearchFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const t = createTranslator(locale)

  const [searchText, setSearchText] = useState<string>(initialQuery)

  useEffect(() => {
    setSearchText(searchParams.get('q') ?? '')
  }, [searchParams])

  const allLabels = useMemo(() => {
    const map = new Map<string, number>()
    for (const post of initialPosts) {
      for (const label of post.labels) {
        map.set(label.name, (map.get(label.name) ?? 0) + 1)
      }
    }
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
  }, [initialPosts])

  const filteredPosts = useMemo(
    () =>
      initialPosts.filter(p =>
        matches(p, searchText.trim().toLowerCase(), activeLabel)
      ),
    [initialPosts, searchText, activeLabel]
  )

  function setParam(key: 'q' | 'label', value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    return params.toString()
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    startTransition(() => {
      router.replace(`/?${setParam('q', searchText.trim())}`, { scroll: false })
    })
  }

  function handleLabelClick(label: string) {
    startTransition(() => {
      const next = activeLabel === label ? '' : label
      router.replace(`/?${setParam('label', next)}`, { scroll: false })
    })
  }

  function handleClear() {
    setSearchText('')
    startTransition(() => {
      router.replace('/', { scroll: false })
    })
  }

  return (
    <section className={styles.searchForm}>
      <section className={styles.searchFormContainer}>
        <form onSubmit={handleSubmit}>
          <div className={styles.searchFormHeader}>
            <h2 className={styles.searchFormTitle}>{t('home.publications')}</h2>
            <span className={styles.searchFormSubTitle}>
              {filteredPosts.length === 1
                ? t('home.search.count.one')
                : t('home.search.count.other', { count: filteredPosts.length })}
            </span>
          </div>

          <input
            className={styles.searchFormInput}
            type="search"
            placeholder={t('home.search.placeholder')}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            aria-label={t('home.search.aria')}
          />
        </form>

        {allLabels.length > 0 && (
          <fieldset
            className={styles.searchFormLabels}
            aria-label={t('home.filter.label')}
          >
            <Tag size={18} aria-hidden />
            {allLabels.map(({ name, count }) => {
              const isActive = activeLabel === name
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => handleLabelClick(name)}
                  aria-pressed={isActive}
                  className={`${styles.searchFormChip} ${
                    isActive ? styles.searchFormChipActive : ''
                  }`}
                >
                  {name}
                  <span className={styles.searchFormChipCount}>{count}</span>
                </button>
              )
            })}
            {(activeLabel || searchText) && (
              <button
                type="button"
                onClick={handleClear}
                className={styles.searchFormClear}
                title={t('home.filter.clear.filters')}
              >
                <X size={14} weight="bold" /> {t('home.filter.clear')}
              </button>
            )}
          </fieldset>
        )}
      </section>

      <section
        className={styles.postCardConainer}
        aria-busy={isPending}
        aria-live="polite"
      >
        {filteredPosts.length === 0 ? (
          <p className="col-span-full p-8 text-center text-base-span">
            {searchText && activeLabel
              ? t('home.search.empty.withBoth', {
                  query: searchText,
                  label: activeLabel,
                })
              : searchText
                ? t('home.search.empty.withQuery', { query: searchText })
                : activeLabel
                  ? t('home.search.empty.withLabel', { label: activeLabel })
                  : t('home.search.empty')}
            {(searchText || activeLabel) && (
              <button
                type="button"
                onClick={handleClear}
                className={styles.searchFormClearInline}
              >
                <ArrowSquareOut size={14} /> {t('home.filter.clear.filters')}
              </button>
            )}
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
                    // biome-ignore lint/security/noDangerouslySetInnerHtml: previewHtml is generated server-side by remark/rehype from author-supplied markdown.
                    dangerouslySetInnerHTML={{ __html: post.previewHtml }}
                  />
                </div>

                <footer>
                  <Link
                    className={styles.postCardLink}
                    href={`/posts/${post.number}`}
                  >
                    {t('home.read.more')}
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
