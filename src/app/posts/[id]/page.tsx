'use client'

import { format, formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'
import {
  // ArrowSquareOut,
  CalendarBlank,
  CaretLeft,
  ChatCircle,
  GithubLogo,
} from 'phosphor-react'
import Markdown from 'react-markdown'

import { useGithub } from '@/hooks/useGithub'

import Link from 'next/link'
import styles from './post.module.css'

export default function PostPage({ params }: { params: { id: string } }) {
  const { issues } = useGithub()

  const post = issues.find(post => post.number === Number(params.id))

  if (!post) {
    return
  }

  const updatedAtDateFormatted = format(
    post.updated_at,
    "d 'de' LLLL 'ás' HH:mm'h'",
    { locale: ptBR }
  )
  const updatedAtDateRelativeToNow = formatDistanceToNow(post.updated_at, {
    locale: ptBR,
    addSuffix: true,
  })

  return (
    <main className={styles.post}>
      <section className={styles.postContainer}>
        <section className={styles.postHeader}>
          <div className={styles.postHeaderButtons}>
            <a href="/">
              <CaretLeft size={22} /> VOLTAR
            </a>
            {/* <a href={post.html_url} target="_blank" rel="noopener noreferrer">
              VER NO GITHUB <ArrowSquareOut size={22} />
            </a> */}
          </div>

          <h2 className={styles.postHeaderTitle}>{post.title}</h2>

          <div className={styles.postHeaderTags}>
            <span>
              <GithubLogo size={22} />
              <Link
                href={'https://github.com/brennoclins'}
                target="_blank"
                rel="noopener noreferrer"
              >
                {post.user.login}
              </Link>
            </span>
            <span>
              <CalendarBlank size={22} />
              <time title={updatedAtDateFormatted}>
                {updatedAtDateRelativeToNow}
              </time>
            </span>
            <span>
              <ChatCircle size={22} />
              {post.comments === 1
                ? `${post.comments} comentário`
                : `${post.comments} comentários`}
            </span>
          </div>
        </section>

        <section className={styles.postContent}>
          <Markdown className={styles.postBody}>{post.body}</Markdown>
        </section>
      </section>
    </main>
  )
}
