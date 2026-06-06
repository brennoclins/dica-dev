import type { GithubIssue } from '@/lib/github'
import { SITE_CONFIG, SITE_URL } from '@/lib/site'

type JsonLdProps = {
  post: GithubIssue
  authorName: string
  authorUrl: string
}

export function ArticleJsonLd({ post, authorName, authorUrl }: JsonLdProps) {
  const description = post.body
    ?.replace(/[#*_>`-]/g, '')
    .slice(0, 200)
    .trim()

  const data = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description,
    image: post.user.avatar_url,
    datePublished: post.created_at,
    dateModified: post.updated_at,
    author: {
      '@type': 'Person',
      name: authorName,
      url: authorUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/icon.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/posts/${post.number}`,
    },
    interactionStatistic: {
      '@type': 'InteractionCounter',
      interactionType: 'https://schema.org/CommentAction',
      userInteractionCount: post.comments,
    },
    keywords: post.labels.map(l => l.name).join(', '),
    articleSection: 'Development',
    inLanguage: SITE_CONFIG.locale,
  }

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON.stringify output is a safe, well-formed string.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

type WebsiteJsonLdProps = {
  authorName: string
  authorUrl: string
}

export function WebsiteJsonLd({ authorName, authorUrl }: WebsiteJsonLdProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: SITE_URL,
    inLanguage: SITE_CONFIG.locale,
    author: {
      '@type': 'Person',
      name: authorName,
      url: authorUrl,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON.stringify output is a safe, well-formed string.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

type PersonJsonLdProps = {
  name: string
  bio: string
  avatarUrl: string
  githubUrl: string
}

export function PersonJsonLd({
  name,
  bio,
  avatarUrl,
  githubUrl,
}: PersonJsonLdProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    description: bio,
    image: avatarUrl,
    url: githubUrl,
    sameAs: [githubUrl],
  }

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON.stringify output is a safe, well-formed string.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
