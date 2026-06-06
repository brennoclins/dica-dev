import { expect, test } from '@playwright/test'

test.describe('Post page', () => {
  test('renders a 404 page for invalid IDs', async ({ page }) => {
    const response = await page.goto('/posts/not-a-number')
    expect(response?.status()).toBe(404)
  })

  test('404 page has navigation back home', async ({ page }) => {
    await page.goto('/posts/99999999-this-does-not-exist')
    const link = page.getByRole('link', { name: /voltar|home/i })
    await expect(link.first()).toBeVisible()
  })

  test('post page has share buttons', async ({ page }) => {
    await page.goto('/')
    const firstCard = page.locator('article a').first()
    if (await firstCard.isVisible().catch(() => false)) {
      await firstCard.click()
      await page.waitForURL(/\/posts\//)
      const shareSection = page.locator('[aria-label*="Compartilhar"]').first()
      await expect(shareSection).toBeVisible()
    }
  })

  test('post page shows reading time when present', async ({ page }) => {
    await page.goto('/')
    const firstCard = page.locator('article a').first()
    if (await firstCard.isVisible().catch(() => false)) {
      await firstCard.click()
      await page.waitForURL(/\/posts\//)
      const readingTime = page.getByText(/min de leitura/i)
      await expect(readingTime.first()).toBeVisible()
    }
  })

  test('post page has JSON-LD structured data', async ({ page }) => {
    await page.goto('/')
    const firstCard = page.locator('article a').first()
    if (await firstCard.isVisible().catch(() => false)) {
      await firstCard.click()
      await page.waitForURL(/\/posts\//)
      const jsonLd = page.locator('script[type="application/ld+json"]')
      const count = await jsonLd.count()
      expect(count).toBeGreaterThanOrEqual(1)
    }
  })
})
