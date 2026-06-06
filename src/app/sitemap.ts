import type { MetadataRoute } from 'next'

import { getGithubIssues, githubConfig } from '@/lib/github'
import { SITE_URL } from '@/lib/site'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const issues = await getGithubIssues()

  const posts: MetadataRoute.Sitemap = issues.map(issue => ({
    url: `${SITE_URL}/posts/${issue.number}`,
    lastModified: new Date(issue.updated_at),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/?ref=feed`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...posts,
    {
      url: `${SITE_URL}/feed.xml`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.5,
    },
  ]
}

export const dynamic = 'force-static'
void githubConfig
