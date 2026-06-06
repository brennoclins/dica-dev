'use client'

import { useState, useTransition } from 'react'

import { type LoadMorePostsResult, loadMorePosts } from '@/app/actions'
import type { Locale } from '@/lib/i18n'
import { createTranslator } from '@/lib/i18n'

import { PostCard, type PostCardData } from './post-card'
import styles from './posts-feed.module.css'

type PostsFeedProps = {
  initialPosts: PostCardData[]
  initialHasMore: boolean
  initialTotalCount: number
  perPage: number
  query: string
  label: string
  locale: Locale
}

export function PostsFeed({
  initialPosts,
  initialHasMore,
  initialTotalCount,
  perPage,
  query,
  label,
  locale,
}: PostsFeedProps) {
  const t = createTranslator(locale)
  const [posts, setPosts] = useState<PostCardData[]>(initialPosts)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [totalCount, setTotalCount] = useState(initialTotalCount)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleLoadMore() {
    setError(null)
    startTransition(async () => {
      try {
        const result: LoadMorePostsResult = await loadMorePosts({
          page: Math.floor(posts.length / perPage) + 1,
          perPage,
          query,
          label,
        })
        setPosts(prev => [...prev, ...result.items])
        setHasMore(result.hasMore)
        setTotalCount(result.total_count)
      } catch (err) {
        setError(err instanceof Error ? err.message : t('home.load.more.empty'))
      }
    })
  }

  const loaded = posts.length
  const remaining = Math.max(0, totalCount - loaded)

  return (
    <section className={styles.feed} aria-busy={isPending} aria-live="polite">
      <header className={styles.feedHeader}>
        <h2 className={styles.feedTitle}>{t('home.publications')}</h2>
        <p className={styles.feedCount}>
          {totalCount > 0
            ? t('home.search.count.other', { count: totalCount })
            : t('home.search.empty')}
        </p>
      </header>

      {posts.length === 0 ? (
        <p className={styles.feedEmpty}>{t('home.search.empty')}</p>
      ) : (
        <ul className={styles.feedGrid}>
          {posts.map(post => (
            <li key={post.number}>
              <PostCard post={post} locale={locale} />
            </li>
          ))}
        </ul>
      )}

      {posts.length > 0 && (
        <div className={styles.feedActions}>
          {error ? (
            <p className={styles.feedError}>{error}</p>
          ) : hasMore ? (
            <button
              type="button"
              onClick={handleLoadMore}
              disabled={isPending}
              className={styles.feedLoadMore}
            >
              {isPending ? t('home.load.more.loading') : t('home.load.more')}
              {remaining > 0 && !isPending && (
                <span className={styles.feedLoadMoreCount}>({remaining})</span>
              )}
            </button>
          ) : (
            <p className={styles.feedEnd}>{t('home.load.more.empty')}</p>
          )}
        </div>
      )}
    </section>
  )
}
