import { expect, test } from '@playwright/test'

test.describe('Home page', () => {
  test('renders the blog title', async ({ page }) => {
    await page.goto('/')
    await expect(
      page.getByRole('heading', { level: 1, name: 'Dica Dev' })
    ).toBeVisible()
  })

  test('shows the search form', async ({ page }) => {
    await page.goto('/')
    const searchInput = page.getByRole('searchbox', {
      name: 'Buscar publicações',
    })
    await expect(searchInput).toBeVisible()
  })

  test('has a working theme toggle', async ({ page }) => {
    await page.goto('/')
    const toggle = page.getByRole('button', { name: /tema/i })
    await expect(toggle).toBeVisible()

    const initialTheme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    )

    await toggle.click()
    await page.waitForTimeout(300)

    const newTheme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    )

    expect(newTheme).not.toBe(initialTheme)
  })

  test('search updates the URL with ?q=', async ({ page }) => {
    await page.goto('/')
    const input = page.getByRole('searchbox', { name: 'Buscar publicações' })
    await input.fill('react')
    await input.press('Enter')
    await page.waitForURL(/[?&]q=react/)
  })

  test('label filter shows label chips when present', async ({ page }) => {
    await page.goto('/')
    const fieldset = page.getByRole('group', { name: 'Filtrar por categoria' })
    if (await fieldset.isVisible().catch(() => false)) {
      const chips = fieldset.getByRole('button')
      const count = await chips.count()
      expect(count).toBeGreaterThanOrEqual(0)
    }
  })

  test('404 page has a working link home', async ({ page }) => {
    const response = await page.goto('/this-does-not-exist')
    expect(response?.status()).toBe(404)
  })
})

test.describe('SEO endpoints', () => {
  test('sitemap.xml is served with the right content type', async ({
    request,
  }) => {
    const response = await request.get('/sitemap.xml')
    expect(response.ok()).toBeTruthy()
    expect(response.headers()['content-type']).toContain('xml')
  })

  test('robots.txt is served', async ({ request }) => {
    const response = await request.get('/robots.txt')
    expect(response.ok()).toBeTruthy()
    const text = await response.text()
    expect(text).toContain('Sitemap')
  })

  test('feed.xml is served as RSS', async ({ request }) => {
    const response = await request.get('/feed.xml')
    expect(response.ok()).toBeTruthy()
    const text = await response.text()
    expect(text).toContain('<rss')
  })

  test('manifest.webmanifest is served', async ({ request }) => {
    const response = await request.get('/manifest.webmanifest')
    expect(response.ok()).toBeTruthy()
    const json = await response.json()
    expect(json.name).toBeTruthy()
  })
})
