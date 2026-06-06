'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

import { type Locale, SUPPORTED_LOCALES } from '@/lib/i18n'

import styles from './language-switcher.module.css'

type LanguageSwitcherProps = {
  current: Locale
}

const LABELS: Record<Locale, string> = {
  'pt-BR': 'PT',
  en: 'EN',
}

export function LanguageSwitcher({ current }: LanguageSwitcherProps) {
  const searchParams = useSearchParams()

  function buildHref(locale: Locale): string {
    const params = new URLSearchParams(searchParams.toString())
    params.set('lang', locale)
    return `/?${params.toString()}`
  }

  return (
    <fieldset className={styles.switcher} aria-label="Language">
      {SUPPORTED_LOCALES.map(locale => {
        const isActive = locale === current
        return (
          <Link
            key={locale}
            href={buildHref(locale)}
            aria-current={isActive ? 'true' : undefined}
            className={`${styles.option} ${
              isActive ? styles.optionActive : ''
            }`}
            scroll={false}
          >
            {LABELS[locale]}
          </Link>
        )
      })}
    </fieldset>
  )
}
