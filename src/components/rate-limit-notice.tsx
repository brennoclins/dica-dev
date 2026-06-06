import type { GithubApiError } from '@/lib/github'

import styles from './rate-limit-notice.module.css'

type RateLimitNoticeProps = {
  error: GithubApiError
}

export function RateLimitNotice({ error }: RateLimitNoticeProps) {
  const isRateLimit =
    error.status === 403 && error.message.toLowerCase().includes('rate limit')

  if (!isRateLimit) return null

  return (
    <div className={styles.notice} role="alert">
      <div className={styles.noticeContent}>
        <h2 className={styles.noticeTitle}>Limite da API do GitHub atingido</h2>
        <p className={styles.noticeText}>{error.message}</p>
        <p className={styles.noticeHint}>
          Para continuar desenvolvendo localmente, adicione um token pessoal no
          arquivo <code>.env.local</code>:
        </p>
        <pre className={styles.noticeCode}>
          <code>GITHUB_TOKEN=ghp_seu_token_aqui</code>
        </pre>
        <a
          className={styles.noticeLink}
          href="https://github.com/settings/tokens/new?description=dica-dev&scopes="
          target="_blank"
          rel="noopener noreferrer"
        >
          Criar token no GitHub
        </a>
      </div>
    </div>
  )
}
