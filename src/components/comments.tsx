'use client'

import Giscus from '@giscus/react'
import { ChatCircleDots } from '@phosphor-icons/react/dist/ssr'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

import styles from './comments.module.css'

type CommentsProps = {
  postNumber: number
  postTitle: string
  repo: string
}

export function Comments({ postNumber, postTitle, repo }: CommentsProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const mapping = 'number' as const

  return (
    <section className={styles.comments} id="comentarios">
      <h3 className={styles.commentsTitle}>
        <ChatCircleDots size={20} /> Comentarios
      </h3>
      <p className={styles.commentsHint}>
        Comentarios sao armazenados como GitHub Discussions neste post (#
        {postNumber}: {postTitle}). Faca login com sua conta GitHub para
        participar.
      </p>
      {mounted ? (
        <Giscus
          id={`comments-${postNumber}`}
          repo={repo as `${string}/${string}`}
          repoId={process.env.NEXT_PUBLIC_GISCUS_REPO_ID ?? ''}
          category={process.env.NEXT_PUBLIC_GISCUS_CATEGORY ?? 'General'}
          categoryId={process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID ?? ''}
          mapping={mapping}
          term={`Post #${postNumber}`}
          strict="0"
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="top"
          theme={resolvedTheme === 'light' ? 'light' : 'dark_dimmed'}
          lang="pt-BR"
          loading="lazy"
        />
      ) : (
        <div className={styles.commentsLoading}>Carregando comentarios...</div>
      )}
    </section>
  )
}
