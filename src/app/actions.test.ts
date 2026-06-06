import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mockFetch = vi.fn()

beforeEach(() => {
  vi.resetModules()
  mockFetch.mockReset()
  vi.stubGlobal('fetch', mockFetch)
  process.env.GITHUB_TOKEN = ''
  process.env.NEXT_PUBLIC_GITHUB_USER = 'brennoclins'
  process.env.NEXT_PUBLIC_GITHUB_REPO = 'dica-dev'
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

function makeIssue(n: number, body: string = 'Hello world') {
  return {
    number: n,
    title: `Issue ${n}`,
    body,
    html_url: `https://github.com/brennoclins/dica-dev/issues/${n}`,
    updated_at: '2026-06-06T00:00:00Z',
    created_at: '2026-06-06T00:00:00Z',
    comments: 0,
    labels: [],
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

function makeIssues(count: number, startNumber: number) {
  return Array.from({ length: count }, (_, i) => makeIssue(startNumber + i))
}

describe('loadMorePosts Server Action', () => {
  it('returns items, total_count and hasMore for the requested page', async () => {
    const items = makeIssues(10, 21)
    mockFetch.mockImplementation(
      okResponse({ total_count: 42, incomplete_results: false, items })
    )

    const { loadMorePosts } = await import('@/app/actions')

    const result = await loadMorePosts({
      page: 2,
      perPage: 10,
      query: '',
      label: '',
    })

    expect(result.items).toHaveLength(10)
    expect(result.items[0]?.number).toBe(21)
    expect(result.total_count).toBe(42)
    expect(result.hasMore).toBe(true)
    expect(result.page).toBe(2)
  })

  it('appends label:"X" to the GitHub search query', async () => {
    mockFetch.mockImplementation(
      okResponse({
        total_count: 1,
        incomplete_results: false,
        items: [makeIssue(1)],
      })
    )

    const { loadMorePosts } = await import('@/app/actions')

    await loadMorePosts({
      page: 2,
      perPage: 10,
      query: 'docker',
      label: 'linux',
    })

    const calledUrl = mockFetch.mock.calls[0]?.[0] as string
    expect(calledUrl).toContain(encodeURIComponent('docker'))
    expect(calledUrl).toContain(encodeURIComponent('label:"linux"'))
    expect(calledUrl).toContain('brennoclins/dica-dev')
  })

  it('clamps page to [2, 10] range', async () => {
    mockFetch.mockImplementation(
      okResponse({
        total_count: 100,
        incomplete_results: false,
        items: [makeIssue(1)],
      })
    )

    const { loadMorePosts } = await import('@/app/actions')

    await loadMorePosts({ page: 1, perPage: 10, query: '', label: '' })
    expect(mockFetch.mock.calls[0]?.[0] as string).toContain('page=2')

    await loadMorePosts({ page: 99, perPage: 10, query: '', label: '' })
    expect(mockFetch.mock.calls[1]?.[0] as string).toContain('page=10')
  })

  it('clamps perPage to [1, 20]', async () => {
    mockFetch.mockImplementation(
      okResponse({
        total_count: 50,
        incomplete_results: false,
        items: [makeIssue(1)],
      })
    )

    const { loadMorePosts } = await import('@/app/actions')

    await loadMorePosts({ page: 2, perPage: 999, query: '', label: '' })
    expect(mockFetch.mock.calls[0]?.[0] as string).toContain('per_page=20')

    await loadMorePosts({ page: 2, perPage: 0, query: '', label: '' })
    expect(mockFetch.mock.calls[1]?.[0] as string).toContain('per_page=1')
  })

  it('hasMore is false when fewer items than perPage are returned', async () => {
    mockFetch.mockImplementation(
      okResponse({
        total_count: 5,
        incomplete_results: false,
        items: [makeIssue(5)],
      })
    )

    const { loadMorePosts } = await import('@/app/actions')

    const result = await loadMorePosts({
      page: 2,
      perPage: 10,
      query: '',
      label: '',
    })

    expect(result.hasMore).toBe(false)
  })

  it('renders server-side preview HTML for each item', async () => {
    mockFetch.mockImplementation(
      okResponse({
        total_count: 1,
        incomplete_results: false,
        items: [makeIssue(1, '# Heading\n\nSome text')],
      })
    )

    const { loadMorePosts } = await import('@/app/actions')

    const result = await loadMorePosts({
      page: 2,
      perPage: 10,
      query: '',
      label: '',
    })

    expect(result.items[0]?.previewHtml).toContain('<h1')
    expect(result.items[0]?.previewHtml).toContain('Heading')
  })
})
