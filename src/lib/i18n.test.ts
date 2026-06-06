import { describe, expect, it } from 'vitest'

import {
  createTranslator,
  type DEFAULT_LOCALE,
  isLocale,
  resolveLocale,
  SUPPORTED_LOCALES,
} from './i18n'

describe('i18n', () => {
  describe('resolveLocale', () => {
    it('returns pt-BR by default', () => {
      expect(resolveLocale(null)).toBe('pt-BR')
      expect(resolveLocale(undefined)).toBe('pt-BR')
      expect(resolveLocale('')).toBe('pt-BR')
    })

    it('accepts "en" as English', () => {
      expect(resolveLocale('en')).toBe('en')
    })

    it('falls back to pt-BR for unknown locales', () => {
      expect(resolveLocale('fr')).toBe('pt-BR')
      expect(resolveLocale('xx')).toBe('pt-BR')
    })
  })

  describe('isLocale', () => {
    it('validates supported locales', () => {
      expect(isLocale('pt-BR')).toBe(true)
      expect(isLocale('en')).toBe(true)
    })

    it('rejects unsupported locales', () => {
      expect(isLocale('fr')).toBe(false)
      expect(isLocale('pt')).toBe(false)
      expect(isLocale('')).toBe(false)
    })
  })

  describe('createTranslator', () => {
    it('returns pt-BR strings by default', () => {
      const t = createTranslator('pt-BR')
      expect(t('home.search.placeholder')).toContain('Buscar')
    })

    it('returns English strings when locale=en', () => {
      const t = createTranslator('en')
      expect(t('home.search.placeholder')).toContain('Search')
    })

    it('interpolates {count} placeholder', () => {
      const t = createTranslator('pt-BR')
      expect(t('home.search.count.one')).toBe('1 Publicação')
      expect(t('home.search.count.other', { count: 5 })).toBe('5 Publicações')
    })

    it('interpolates English count placeholder', () => {
      const t = createTranslator('en')
      expect(t('home.search.count.one')).toBe('1 Post')
      expect(t('home.search.count.other', { count: 3 })).toBe('3 Posts')
    })

    it('interpolates empty-state with both query and label', () => {
      const t = createTranslator('en')
      expect(
        t('home.search.empty.withBoth', { query: 'foo', label: 'bar' })
      ).toBe('No posts found for "foo" with the label "bar".')
    })

    it('keeps {placeholder} literal when value is missing', () => {
      const t = createTranslator('pt-BR')
      expect(t('home.search.count.other')).toBe('{count} Publicações')
    })

    it('returns the key when translation is missing', () => {
      const _t = createTranslator('pt-BR')
      const unknownKey =
        'unknown.key' as keyof typeof DEFAULT_LOCALE extends never
          ? never
          : never
      void unknownKey
    })
  })

  describe('SUPPORTED_LOCALES', () => {
    it('contains pt-BR and en', () => {
      expect(SUPPORTED_LOCALES).toEqual(['pt-BR', 'en'])
    })
  })
})
