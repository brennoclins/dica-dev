'use client'

import { Tag, X } from '@phosphor-icons/react/dist/ssr'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  type FormEvent,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from 'react'

import type { GithubLabel } from '@/lib/github'
import { createTranslator, type Locale } from '@/lib/i18n'

import styles from './search-form.module.css'

type SearchFormProps = {
  labels: GithubLabel[]
  initialQuery?: string
  activeLabel?: string
  locale?: Locale
}

export function SearchForm({
  labels,
  initialQuery = '',
  activeLabel = '',
  locale = 'pt-BR',
}: SearchFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const t = createTranslator(locale)

  const [searchText, setSearchText] = useState<string>(initialQuery)

  useEffect(() => {
    setSearchText(searchParams.get('q') ?? '')
  }, [searchParams])

  const allLabels = useMemo(
    () => labels.slice().sort((a, b) => a.name.localeCompare(b.name)),
    [labels]
  )

  function setParam(key: 'q' | 'label', value: string): string {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    return params.toString()
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    startTransition(() => {
      router.replace(`/?${setParam('q', searchText.trim())}`, { scroll: false })
    })
  }

  function handleLabelClick(label: string) {
    startTransition(() => {
      const next = activeLabel === label ? '' : label
      router.replace(`/?${setParam('label', next)}`, { scroll: false })
    })
  }

  function handleClear() {
    setSearchText('')
    startTransition(() => {
      router.replace('/', { scroll: false })
    })
  }

  return (
    <div className={styles.searchForm} aria-busy={isPending}>
      <form className={styles.searchFormForm} onSubmit={handleSubmit}>
        <input
          className={styles.searchFormInput}
          type="search"
          placeholder={t('home.search.placeholder')}
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          aria-label={t('home.search.aria')}
        />
      </form>

      {allLabels.length > 0 && (
        <fieldset
          className={styles.searchFormLabels}
          aria-label={t('home.filter.label')}
        >
          <Tag size={18} aria-hidden />
          {allLabels.map(label => {
            const isActive = activeLabel === label.name
            return (
              <button
                key={label.id}
                type="button"
                onClick={() => handleLabelClick(label.name)}
                aria-pressed={isActive}
                className={`${styles.searchFormChip} ${
                  isActive ? styles.searchFormChipActive : ''
                }`}
              >
                {label.name}
              </button>
            )
          })}
          {(activeLabel || searchText) && (
            <button
              type="button"
              onClick={handleClear}
              className={styles.searchFormClear}
              title={t('home.filter.clear.filters')}
            >
              <X size={14} weight="bold" /> {t('home.filter.clear')}
            </button>
          )}
        </fieldset>
      )}
    </div>
  )
}
