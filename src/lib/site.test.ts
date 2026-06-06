import { describe, expect, it } from 'vitest'

import { EXCLUDE_LABELS, isExcludedByLabel } from './site'

describe('isExcludedByLabel', () => {
  it('excludes issues with default meta labels', () => {
    expect(isExcludedByLabel([{ name: 'meta' }])).toBe(true)
    expect(isExcludedByLabel([{ name: 'internal' }])).toBe(true)
    expect(isExcludedByLabel([{ name: '_meta' }])).toBe(true)
    expect(isExcludedByLabel([{ name: '_internal' }])).toBe(true)
    expect(isExcludedByLabel([{ name: 'admin' }])).toBe(true)
  })

  it('is case-insensitive', () => {
    expect(isExcludedByLabel([{ name: 'META' }])).toBe(true)
    expect(isExcludedByLabel([{ name: 'Internal' }])).toBe(true)
  })

  it('does not exclude issues with non-meta labels', () => {
    expect(isExcludedByLabel([{ name: 'bug' }])).toBe(false)
    expect(isExcludedByLabel([{ name: 'enhancement' }])).toBe(false)
    expect(isExcludedByLabel([])).toBe(false)
  })

  it('excludes if ANY label is in the meta list', () => {
    expect(
      isExcludedByLabel([{ name: 'bug' }, { name: 'meta' }, { name: 'help' }])
    ).toBe(true)
  })

  it('ships with sane defaults', () => {
    expect(EXCLUDE_LABELS).toContain('meta')
    expect(EXCLUDE_LABELS).toContain('internal')
    expect(EXCLUDE_LABELS.length).toBeGreaterThanOrEqual(5)
  })
})
