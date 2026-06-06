import 'server-only'

const GITHUB_API_BASE = 'https://api.github.com'

const GITHUB_USER = process.env.NEXT_PUBLIC_GITHUB_USER || 'brennoclins'
const GITHUB_REPO = process.env.NEXT_PUBLIC_GITHUB_REPO || 'dica-dev'
const GITHUB_TOKEN = process.env.GITHUB_TOKEN

const DEFAULT_REVALIDATE_SECONDS = 60 * 60

export type GithubLabel = {
  id: number
  name: string
  color: string
  description: string | null
}

export type GithubUser = {
  id: number
  login: string
  name: string | null
  bio: string | null
  company: string | null
  avatar_url: string
  email: string | null
  followers: number
  following: number
  html_url: string
}

export type GithubIssue = {
  number: number
  title: string
  body: string
  html_url: string
  updated_at: string
  created_at: string
  comments: number
  labels: GithubLabel[]
  user: {
    login: string
    avatar_url: string
    html_url: string
  }
}

class GithubApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly endpoint: string
  ) {
    super(message)
    this.name = 'GithubApiError'
  }
}

async function githubFetch<T>(
  endpoint: string,
  options: { revalidate?: number | false } = {}
): Promise<T> {
  const { revalidate = DEFAULT_REVALIDATE_SECONDS } = options

  const headers: HeadersInit = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
  if (GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${GITHUB_TOKEN}`
  }

  const url = endpoint.startsWith('http')
    ? endpoint
    : `${GITHUB_API_BASE}${endpoint}`

  const response = await fetch(url, {
    headers,
    next: revalidate === false ? undefined : { revalidate },
    cache: revalidate === false ? 'no-store' : undefined,
  })

  if (!response.ok) {
    const remaining = response.headers.get('x-ratelimit-remaining')
    if (response.status === 403 && remaining === '0') {
      throw new GithubApiError(
        'GitHub API rate limit exceeded. Set GITHUB_TOKEN to raise the limit from 60 to 5000 req/h.',
        response.status,
        endpoint
      )
    }
    if (response.status === 404) {
      throw new GithubApiError(
        `Not found: ${endpoint}`,
        response.status,
        endpoint
      )
    }
    throw new GithubApiError(
      `GitHub API ${response.status}: ${response.statusText}`,
      response.status,
      endpoint
    )
  }

  return response.json() as Promise<T>
}

export async function getGithubUser(
  username: string = GITHUB_USER
): Promise<GithubUser> {
  return githubFetch<GithubUser>(`/users/${username}`)
}

type SearchIssuesResponse = {
  total_count: number
  incomplete_results: boolean
  items: GithubIssue[]
}

export async function getGithubIssues(
  query: string = '',
  user: string = GITHUB_USER,
  repo: string = GITHUB_REPO
): Promise<GithubIssue[]> {
  const trimmed = query.trim()
  const q = trimmed
    ? `${encodeURIComponent(trimmed)}+repo:${user}/${repo}`
    : `repo:${user}/${repo}`

  let page = 1
  const perPage = 100
  const all: GithubIssue[] = []

  while (true) {
    const data = await githubFetch<SearchIssuesResponse>(
      `/search/issues?q=${q}&page=${page}&per_page=${perPage}&sort=updated&order=desc`
    )
    all.push(...data.items)

    if (data.items.length < perPage || all.length >= data.total_count) break
    page++

    if (page > 10) break
  }

  return all
}

export async function getGithubIssue(
  issueNumber: number,
  user: string = GITHUB_USER,
  repo: string = GITHUB_REPO
): Promise<GithubIssue> {
  return githubFetch<GithubIssue>(
    `/repos/${user}/${repo}/issues/${issueNumber}`
  )
}

export async function getGithubLabels(
  user: string = GITHUB_USER,
  repo: string = GITHUB_REPO
): Promise<GithubLabel[]> {
  return githubFetch<GithubLabel[]>(
    `/repos/${user}/${repo}/labels?per_page=100`
  )
}

export const githubConfig = {
  user: GITHUB_USER,
  repo: GITHUB_REPO,
  hasToken: Boolean(GITHUB_TOKEN),
} as const

export { GithubApiError }
