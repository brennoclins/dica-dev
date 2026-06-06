import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mockFetch = vi.fn()

beforeEach(() => {
  vi.resetModules()
  mockFetch.mockReset()
  vi.stubGlobal('fetch', mockFetch)
  process.env.GITHUB_TOKEN = ''
  process.env.NEXT_PUBLIC_GITHUB_USER = 'brennoclins'
  process.env.NEXT_PUBLIC_GITHUB_REPO = 'dica-dev'
  delete process.env.GITHUB_STATE
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

function makeIssue(n: number, labels: { name: string }[] = []) {
  return {
    number: n,
    title: `Issue ${n}`,
    body: '',
    html_url: `https://github.com/brennoclins/dica-dev/issues/${n}`,
    updated_at: '2026-06-06T00:00:00Z',
    created_at: '2026-06-06T00:00:00Z',
    comments: 0,
    labels,
    user: {
      login: 'brennoclins',
      avatar_url: 'https://example.com/a.png',
      html_url: 'https://github.com/brennoclins',
    },
  }
}

function okResponse(payload: unknown) {
  return () =>
    new Response(JSON.stringify(payload), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    })
}

describe('getGithubIssuesPage state filter', () => {
  it('appends is:open to the query by default', async () => {
    mockFetch.mockImplementation(
      okResponse({ total_count: 0, incomplete_results: false, items: [] })
    )

    const { getGithubIssuesPage } = await import('@/lib/github')

    await getGithubIssuesPage(1, 10, '')

    const calledUrl = mockFetch.mock.calls[0]?.[0] as string
    expect(calledUrl).toContain('is:open')
  })

  it('appends is:open when GITHUB_STATE=open explicitly', async () => {
    process.env.GITHUB_STATE = 'open'
    mockFetch.mockImplementation(
      okResponse({ total_count: 0, incomplete_results: false, items: [] })
    )

    const { getGithubIssuesPage } = await import('@/lib/github')

    await getGithubIssuesPage(1, 10, '')

    const calledUrl = mockFetch.mock.calls[0]?.[0] as string
    expect(calledUrl).toContain('is:open')
  })

  it('appends is:closed when GITHUB_STATE=closed', async () => {
    process.env.GITHUB_STATE = 'closed'
    mockFetch.mockImplementation(
      okResponse({ total_count: 0, incomplete_results: false, items: [] })
    )

    const { getGithubIssuesPage } = await import('@/lib/github')

    await getGithubIssuesPage(1, 10, '')

    const calledUrl = mockFetch.mock.calls[0]?.[0] as string
    expect(calledUrl).toContain('is:closed')
    expect(calledUrl).not.toContain('is:open')
  })

  it('omits state filter when GITHUB_STATE=all', async () => {
    process.env.GITHUB_STATE = 'all'
    mockFetch.mockImplementation(
      okResponse({ total_count: 0, incomplete_results: false, items: [] })
    )

    const { getGithubIssuesPage } = await import('@/lib/github')

    await getGithubIssuesPage(1, 10, '')

    const calledUrl = mockFetch.mock.calls[0]?.[0] as string
    expect(calledUrl).not.toContain('is:open')
    expect(calledUrl).not.toContain('is:closed')
  })

  it('falls back to open for unknown GITHUB_STATE values', async () => {
    process.env.GITHUB_STATE = 'banana'
    mockFetch.mockImplementation(
      okResponse({ total_count: 0, incomplete_results: false, items: [] })
    )

    const { getGithubIssuesPage } = await import('@/lib/github')

    await getGithubIssuesPage(1, 10, '')

    const calledUrl = mockFetch.mock.calls[0]?.[0] as string
    expect(calledUrl).toContain('is:open')
  })

  it('combines is:open with a user query', async () => {
    mockFetch.mockImplementation(
      okResponse({ total_count: 0, incomplete_results: false, items: [] })
    )

    const { getGithubIssuesPage } = await import('@/lib/github')

    await getGithubIssuesPage(1, 10, 'docker')

    const calledUrl = mockFetch.mock.calls[0]?.[0] as string
    expect(calledUrl).toContain(encodeURIComponent('docker'))
    expect(calledUrl).toContain('is:open')
  })

  it('filters out excluded-label issues after the state filter', async () => {
    mockFetch.mockImplementation(
      okResponse({
        total_count: 2,
        incomplete_results: false,
        items: [
          makeIssue(1, [{ name: 'bug' }]),
          makeIssue(2, [{ name: 'meta' }]),
          makeIssue(3, [{ name: 'enhancement' }]),
        ],
      })
    )

    const { getGithubIssuesPage } = await import('@/lib/github')

    const result = await getGithubIssuesPage(1, 10, '')

    expect(result.items.map(i => i.number)).toEqual([1, 3])
  })
})
