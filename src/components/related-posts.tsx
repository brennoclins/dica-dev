import { ArrowRight } from '@phosphor-icons/react/dist/ssr'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'
import Link from 'next/link'
import type { GithubIssue } from '@/lib/github'

import styles from './related-posts.module.css'

type RelatedPostsProps = {
  posts: GithubIssue[]
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null

  return (
    <section className={styles.related} aria-label="Posts relacionados">
      <h3 className={styles.relatedTitle}>Posts relacionados</h3>
      <ul className={styles.relatedList}>
        {posts.map(post => (
          <li key={post.number} className={styles.relatedItem}>
            <Link href={`/posts/${post.number}`} className={styles.relatedLink}>
              <div className={styles.relatedContent}>
                <h4 className={styles.relatedPostTitle}>{post.title}</h4>
                <p className={styles.relatedMeta}>
                  {formatDistanceToNow(new Date(post.updated_at), {
                    locale: ptBR,
                    addSuffix: true,
                  })}
                  {' · '}
                  {post.comments === 1
                    ? `${post.comments} comentário`
                    : `${post.comments} comentários`}
                </p>
                {post.labels.length > 0 && (
                  <div className={styles.relatedLabels}>
                    {post.labels.slice(0, 3).map(label => (
                      <span key={label.id} className={styles.relatedLabel}>
                        {label.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <ArrowRight size={20} className={styles.relatedArrow} />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
