import {
  BookOpen,
  CalendarBlank,
  CaretLeft,
  ChatCircle,
  Clock,
  GithubLogo,
  ListChecks,
} from '@phosphor-icons/react/dist/ssr'
import { format, formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArticleJsonLd } from '@/components/json-ld'
import { RelatedPosts } from '@/components/related-posts'
import { ShareButtons } from '@/components/share-buttons'
import {
  GithubApiError,
  getGithubIssue,
  getGithubIssues,
  getRelatedIssues,
  githubConfig,
} from '@/lib/github'
import { extractToc, readingTime, renderMarkdown } from '@/lib/markdown'
import { SITE_URL } from '@/lib/site'

import styles from './post.module.css'

export const revalidate = 3600
export const dynamicParams = true

type PostPageProps = {
  params: Promise<{ id: string }>
}

const SSG_LIMIT = 5

export async function generateStaticParams() {
  if (!githubConfig.hasToken) {
    return []
  }
  try {
    const issues = await getGithubIssues()
    return issues.slice(0, SSG_LIMIT).map(issue => ({
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
  const toc = extractToc(post.body ?? '')
  const readTime = readingTime(post.body ?? '')
  const related = await getRelatedIssues(
    post.number,
    post.labels.map(l => l.name),
    3
  )
  const postUrl = `${SITE_URL}/posts/${post.number}`

  return (
    <main className={styles.post}>
      <ArticleJsonLd
        post={post}
        authorName={post.user.login}
        authorUrl={post.user.html_url}
      />
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
              <Clock size={22} />
              {readTime.text}
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
          {toc.length > 0 && (
            <aside className={styles.postToc} aria-label="Sumario do artigo">
              <h3 className={styles.postTocTitle}>
                <ListChecks size={20} /> Sumario
              </h3>
              <nav>
                <ol className={styles.postTocList}>
                  {toc.map(item => (
                    <li
                      key={item.id}
                      className={`${styles.postTocItem} ${item.level === 3 ? styles.postTocSub : ''}`}
                    >
                      <a href={`#${item.id}`}>{item.text}</a>
                    </li>
                  ))}
                </ol>
              </nav>
            </aside>
          )}

          <div
            className={`${styles.postBody} post-body`}
            // biome-ignore lint/security/noDangerouslySetInnerHtml: HTML is generated server-side by rehype/remark from author-supplied markdown; the post page is a trusted authoring flow.
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />

          {post.labels.length > 0 && (
            <footer className={styles.postFooter}>
              <h3 className={styles.postFooterTitle}>
                <BookOpen size={20} /> Tags
              </h3>
              <ul className={styles.postFooterLabels}>
                {post.labels.map(label => (
                  <li key={label.id}>
                    <Link
                      href={`/?label=${encodeURIComponent(label.name)}`}
                      title={`Filtrar por ${label.name}`}
                    >
                      {label.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </footer>
          )}

          <ShareButtons title={post.title} url={postUrl} />
          <RelatedPosts posts={related} />
        </section>
      </section>
    </main>
  )
}
