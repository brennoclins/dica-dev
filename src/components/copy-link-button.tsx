'use client'

import { Link as LinkIcon } from '@phosphor-icons/react/dist/ssr'

import styles from './share-buttons.module.css'

type CopyLinkButtonProps = {
  url: string
  copyLabel?: string
  copiedLabel?: string
}

export function CopyLinkButton({
  url,
  copyLabel = 'Copiar link',
  copiedLabel = 'Copiado!',
}: CopyLinkButtonProps) {
  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    const button = event.currentTarget
    navigator.clipboard
      .writeText(url)
      .then(() => {
        button.classList.add(styles.shareButtonCopied)
        const original = button.innerHTML
        button.innerHTML = copiedLabel
        setTimeout(() => {
          button.classList.remove(styles.shareButtonCopied)
          button.innerHTML = original
        }, 1500)
      })
      .catch(() => {})
  }

  return (
    <button
      type="button"
      className={styles.shareButton}
      data-copy-url={url}
      aria-label={copyLabel}
      onClick={handleClick}
    >
      <LinkIcon size={18} weight="bold" />
    </button>
  )
}
