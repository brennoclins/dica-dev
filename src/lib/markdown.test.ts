import { describe, expect, it } from 'vitest'

import { extractToc, readingTime, renderMarkdown } from './markdown'

describe('renderMarkdown', () => {
  it('renders headings with slugified ids', async () => {
    const html = await renderMarkdown('## Hello World\n\nA paragraph.')
    expect(html).toContain('<h2 id="hello-world">')
    expect(html).toContain('Hello World')
    expect(html).toContain('<p>A paragraph.</p>')
  })

  it('autolinks headings', async () => {
    const html = await renderMarkdown('## Auto Link')
    expect(html).toContain('class="heading-anchor"')
    expect(html).toContain('href="#auto-link"')
  })

  it('renders GFM tables', async () => {
    const md = `
| col1 | col2 |
|------|------|
| a    | b    |
| c    | d    |
`
    const html = await renderMarkdown(md)
    expect(html).toContain('<table>')
    expect(html).toContain('<th>col1</th>')
    expect(html).toContain('<td>a</td>')
  })

  it('renders GFM task lists', async () => {
    const md = '- [x] done\n- [ ] todo'
    const html = await renderMarkdown(md)
    expect(html).toContain('checked')
  })

  it('syntax-highlights fenced code blocks', async () => {
    const md = '```ts\nconst x = 1\n```'
    const html = await renderMarkdown(md)
    expect(html).toContain('<pre')
    expect(html).toContain('<code')
    expect(html).toContain('data-language="ts"')
    expect(html).toContain('data-line')
  })

  it('strips code blocks for inline counting', async () => {
    const html = await renderMarkdown('text\n\n```\ncode\n```\nmore text')
    expect(html).toContain('text')
    expect(html).toContain('more text')
  })
})

describe('extractToc', () => {
  it('extracts h2 and h3 headings with stable slugs', () => {
    const md = `
# Title

## First Section
content

### Sub One
content

## Second Section
content
`
    const toc = extractToc(md)
    expect(toc).toEqual([
      { level: 2, text: 'First Section', id: 'first-section' },
      { level: 3, text: 'Sub One', id: 'sub-one' },
      { level: 2, text: 'Second Section', id: 'second-section' },
    ])
  })

  it('ignores headings inside code fences', () => {
    const md = `
## Real Heading

\`\`\`
## Fake Heading
\`\`\`

## Another Real
`
    const toc = extractToc(md)
    expect(toc).toHaveLength(2)
    expect(toc[0].text).toBe('Real Heading')
    expect(toc[1].text).toBe('Another Real')
  })

  it('skips h1 and h4+', () => {
    const md = `
# H1
## H2
### H3
#### H4
`
    const toc = extractToc(md)
    expect(toc).toHaveLength(2)
    expect(toc.map(t => t.level)).toEqual([2, 3])
  })

  it('returns empty for empty markdown', () => {
    expect(extractToc('')).toEqual([])
  })

  it('deduplicates slugs when text repeats', () => {
    const md = `
## Repeated
text

## Repeated
more text
`
    const toc = extractToc(md)
    expect(toc[0].id).toBe('repeated')
    expect(toc[1].id).toBe('repeated-1')
  })
})

describe('readingTime', () => {
  it('returns at least 1 minute for any content', () => {
    const result = readingTime('oi')
    expect(result.minutes).toBeGreaterThanOrEqual(1)
    expect(result.text).toMatch(/min de leitura/)
  })

  it('counts words correctly', () => {
    const result = readingTime('one two three four five')
    expect(result.words).toBe(5)
  })

  it('strips code blocks before counting', () => {
    const result = readingTime('um dois\n\n```\nfoo bar baz\n```\ntres quatro')
    expect(result.words).toBe(4)
  })

  it('strips inline code before counting', () => {
    const result = readingTime('olha esse `comando` legal')
    expect(result.words).toBe(3)
  })

  it('returns 0 words for empty input', () => {
    const result = readingTime('')
    expect(result.words).toBe(0)
    expect(result.minutes).toBe(1)
  })
})
