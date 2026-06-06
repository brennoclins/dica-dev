import {
  Link as LinkIcon,
  RedditLogo,
  TwitterLogo,
} from '@phosphor-icons/react/dist/ssr'

import styles from './share-buttons.module.css'

type ShareButtonsProps = {
  title: string
  url: string
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const encodedTitle = encodeURIComponent(title)
  const encodedUrl = encodeURIComponent(url)

  const twitter = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`
  const reddit = `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`
  const linkedin = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`

  return (
    <div className={styles.share}>
      <span className={styles.shareTitle}>Compartilhar</span>
      <div className={styles.shareButtons}>
        <a
          className={styles.shareButton}
          href={twitter}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Compartilhar no X (Twitter)"
        >
          <TwitterLogo size={18} weight="fill" />
        </a>
        <a
          className={styles.shareButton}
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Compartilhar no LinkedIn"
        >
          <LinkedinLogo size={18} />
        </a>
        <a
          className={styles.shareButton}
          href={reddit}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Compartilhar no Reddit"
        >
          <RedditLogo size={18} weight="fill" />
        </a>
        <CopyLinkButton url={url} />
      </div>
    </div>
  )
}

function LinkedinLogo({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      role="img"
      aria-label="LinkedIn"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function CopyLinkButton({ url }: { url: string }) {
  return (
    <button
      type="button"
      className={styles.shareButton}
      data-copy-url={url}
      aria-label="Copiar link"
      onClick={event => {
        const button = event.currentTarget
        navigator.clipboard
          .writeText(url)
          .then(() => {
            button.classList.add(styles.shareButtonCopied)
            const original = button.innerHTML
            button.innerHTML = 'Copiado!'
            setTimeout(() => {
              button.classList.remove(styles.shareButtonCopied)
              button.innerHTML = original
            }, 1500)
          })
          .catch(() => {})
      }}
    >
      <LinkIcon size={18} weight="bold" />
    </button>
  )
}
