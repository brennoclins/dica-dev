'use server'

import { type GithubIssue, getGithubIssuesPage } from '@/lib/github'
import { renderMarkdownPreview } from '@/lib/markdown'

const PREVIEW_LENGTH = 600
const MAX_PAGE = 10

export type PostPreviewPayload = {
  number: number
  title: string
  updated_at: string
  labels: GithubIssue['labels']
  previewHtml: string
}

export type LoadMorePostsResult = {
  items: PostPreviewPayload[]
  hasMore: boolean
  total_count: number
  page: number
}

export async function loadMorePosts(input: {
  page: number
  perPage: number
  query: string
  label: string
}): Promise<LoadMorePostsResult> {
  const page = Math.max(2, Math.min(MAX_PAGE, Math.floor(input.page)))
  const perPage = Math.max(1, Math.min(20, Math.floor(input.perPage)))

  const labelQuery = input.label ? `label:"${input.label}"` : ''
  const fullQuery = [input.query.trim(), labelQuery].filter(Boolean).join(' ')

  const result = await getGithubIssuesPage(page, perPage, fullQuery)

  const items: PostPreviewPayload[] = await Promise.all(
    result.items.map(async issue => ({
      number: issue.number,
      title: issue.title,
      updated_at: issue.updated_at,
      labels: issue.labels,
      previewHtml: await renderMarkdownPreview(
        issue.body ?? '',
        PREVIEW_LENGTH
      ),
    }))
  )

  return {
    items,
    hasMore: result.hasMore,
    total_count: result.total_count,
    page,
  }
}
