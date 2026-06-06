import { format, formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'
import Link from 'next/link'

import type { GithubLabel } from '@/lib/github'
import { createTranslator, type Locale } from '@/lib/i18n'

import styles from './post-card.module.css'

export type PostCardData = {
  number: number
  title: string
  updated_at: string
  labels: GithubLabel[]
  previewHtml: string
}

type PostCardProps = {
  post: PostCardData
  locale: Locale
}

export function PostCard({ post, locale }: PostCardProps) {
  const t = createTranslator(locale)
  const updatedAt = new Date(post.updated_at)
  const updatedAtFormatted = format(updatedAt, "d 'de' LLLL 'ás' HH:mm'h'", {
    locale: ptBR,
  })
  const updatedAtRelative = formatDistanceToNow(updatedAt, {
    locale: ptBR,
    addSuffix: true,
  })

  return (
    <article className={styles.card}>
      <header className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>{post.title}</h3>
        <time
          className={styles.cardDate}
          dateTime={post.updated_at}
          title={updatedAtFormatted}
        >
          {updatedAtRelative}
        </time>
      </header>

      <div
        className={styles.cardPreview}
        // biome-ignore lint/security/noDangerouslySetInnerHtml: previewHtml is generated server-side by remark/rehype from author-supplied markdown.
        dangerouslySetInnerHTML={{ __html: post.previewHtml }}
      />

      <footer className={styles.cardFooter}>
        <Link className={styles.cardLink} href={`/posts/${post.number}`}>
          {t('home.read.more')}
        </Link>
      </footer>
    </article>
  )
}
