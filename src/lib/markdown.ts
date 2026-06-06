import 'server-only'

import {
  transformerNotationDiff,
  transformerNotationHighlight,
} from '@shikijs/transformers'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'

const PRETTY_CODE_OPTIONS = {
  keepBackground: true,
  defaultLang: 'plaintext',
  theme: 'github-dark-dimmed',
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
