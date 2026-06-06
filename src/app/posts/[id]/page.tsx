import {
  CalendarBlank,
  CaretLeft,
  ChatCircle,
  GithubLogo,
} from '@phosphor-icons/react/dist/ssr'
import { format, formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import {
  GithubApiError,
  getGithubIssue,
  getGithubIssues,
  githubConfig,
} from '@/lib/github'
import { renderMarkdown } from '@/lib/markdown'

import styles from './post.module.css'

export const revalidate = 3600

type PostPageProps = {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  try {
    const issues = await getGithubIssues()
    return issues.slice(0, 50).map(issue => ({
      id: String(issue.number),
    }))
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { id } = await params

  try {
    const post = await getGithubIssue(Number(id))
    const description = post.body
      ?.replace(/[#*_>\-`[\]()]/g, '')
      .slice(0, 160)
      .trim()

    return {
      title: `${post.title} | Dica Dev`,
      description,
      openGraph: {
        title: post.title,
        description,
        type: 'article',
        publishedTime: post.created_at,
        modifiedTime: post.updated_at,
        authors: [post.user.login],
        url: `/posts/${post.number}`,
        images: [{ url: post.user.avatar_url, alt: post.user.login }],
      },
      twitter: {
        card: 'summary',
        title: post.title,
        description,
      },
    }
  } catch {
    return {
      title: 'Publicação não encontrada | Dica Dev',
    }
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params
  const issueNumber = Number(id)

  if (!Number.isFinite(issueNumber) || issueNumber <= 0) {
    notFound()
  }

  let post: Awaited<ReturnType<typeof getGithubIssue>>
  try {
    post = await getGithubIssue(issueNumber)
  } catch (err) {
    if (err instanceof GithubApiError && err.status === 404) {
      notFound()
    }
    throw err
  }

  const updatedAt = new Date(post.updated_at)
  const updatedAtFormatted = format(updatedAt, "d 'de' LLLL 'ás' HH:mm'h'", {
    locale: ptBR,
  })
  const updatedAtRelative = formatDistanceToNow(updatedAt, {
    locale: ptBR,
    addSuffix: true,
  })
  const bodyHtml = await renderMarkdown(post.body ?? '')

  return (
    <main className={styles.post}>
      <section className={styles.postContainer}>
        <section className={styles.postHeader}>
          <div className={styles.postHeaderButtons}>
            <Link href="/">
              <CaretLeft size={22} /> VOLTAR
            </Link>
          </div>

          <h2 className={styles.postHeaderTitle}>{post.title}</h2>

          <div className={styles.postHeaderTags}>
            <span>
              <GithubLogo size={22} />
              <Link
                href={`https://github.com/${githubConfig.user}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {post.user.login}
              </Link>
            </span>
            <span>
              <CalendarBlank size={22} />
              <time title={updatedAtFormatted} dateTime={post.updated_at}>
                {updatedAtRelative}
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
          <div
            className={`${styles.postBody} post-body`}
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />
        </section>
      </section>
    </main>
  )
}
