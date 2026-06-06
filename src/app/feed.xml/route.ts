import { Feed } from 'feed'

import { getGithubIssues, githubConfig } from '@/lib/github'
import { renderMarkdownPreview } from '@/lib/markdown'
import { SITE_CONFIG, SITE_URL } from '@/lib/site'

export const revalidate = 3600

export async function GET() {
  const issues = await getGithubIssues()

  const feed = new Feed({
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    id: SITE_URL,
    link: SITE_URL,
    language: SITE_CONFIG.locale,
    image: `${SITE_URL}/icon.png`,
    favicon: `${SITE_URL}/favicon.ico`,
    copyright: `© ${new Date().getFullYear()} ${SITE_CONFIG.author}`,
    updated: issues[0] ? new Date(issues[0].updated_at) : new Date(),
    generator: 'Next.js',
    feedLinks: {
      rss: `${SITE_URL}/feed.xml`,
    },
    author: {
      name: SITE_CONFIG.author,
      link: SITE_CONFIG.githubRepo,
    },
  })

  for (const issue of issues) {
    const previewHtml = await renderMarkdownPreview(issue.body ?? '', 800)
    const url = `${SITE_URL}/posts/${issue.number}`
    const description = issue.body
      ?.replace(/[#*_>`-]/g, '')
      .slice(0, 240)
      .trim()

    feed.addItem({
      title: issue.title,
      id: url,
      link: url,
      description,
      content: previewHtml,
      date: new Date(issue.updated_at),
      author: [
        {
          name: issue.user.login,
          link: issue.user.html_url,
        },
      ],
      category: issue.labels.map(label => ({
        name: label.name,
      })),
    })
  }

  return new Response(feed.rss2(), {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}

void githubConfig
