import 'server-only'

import {
  transformerNotationDiff,
  transformerNotationHighlight,
} from '@shikijs/transformers'
import GithubSlugger from 'github-slugger'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'

import type { TocItem } from '@/types/toc'

const PRETTY_CODE_OPTIONS = {
  keepBackground: true,
  defaultLang: 'plaintext',
  theme: {
    dark: 'github-dark-dimmed',
    light: 'github-light',
  },
  transformers: [transformerNotationDiff(), transformerNotationHighlight()],
}

const fullProcessor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(
    rehypePrettyCode,
    PRETTY_CODE_OPTIONS as Parameters<typeof rehypePrettyCode>[0]
  )
  .use(rehypeSlug)
  .use(rehypeAutolinkHeadings, {
    behavior: 'wrap',
    properties: { className: ['heading-anchor'] },
  })
  .use(rehypeStringify)

const previewProcessor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeStringify)

export async function renderMarkdown(markdown: string): Promise<string> {
  const file = await fullProcessor.process(markdown)
  return String(file)
}

export async function renderMarkdownPreview(
  markdown: string,
  maxLength = 600
): Promise<string> {
  const truncated = markdown.slice(0, maxLength)
  const file = await previewProcessor.process(truncated)
  return String(file)
}

export function extractToc(markdown: string): TocItem[] {
  const slugger = new GithubSlugger()
  const lines = markdown.split('\n')
  const toc: TocItem[] = []

  let inFence = false
  for (const line of lines) {
    if (line.trim().startsWith('```')) {
      inFence = !inFence
      continue
    }
    if (inFence) continue

    const match = /^(#{1,4})\s+(.+?)\s*#*\s*$/.exec(line)
    if (!match) continue

    const level = match[1].length
    if (level < 2 || level > 3) continue

    const text = match[2].trim()
    const id = slugger.slug(text)
    toc.push({ level, text, id })
  }

  return toc
}

const WORDS_PER_MINUTE = 200

export function readingTime(markdown: string): {
  words: number
  minutes: number
  text: string
} {
  const text = markdown
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]+`/g, '')
    .replace(/[#*_>`~\-![\]()]/g, ' ')
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  const words = text ? text.split(' ').length : 0
  const minutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE))
  return {
    words,
    minutes,
    text: `${minutes} min de leitura`,
  }
}
