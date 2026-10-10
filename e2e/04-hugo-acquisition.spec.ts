import { test, expect } from '@playwright/test'

test.describe('Hugo acquisition page', () => {
  test('serves the complete lesson with tracked product links', async ({ page }) => {
    await page.goto('/demain-des-laube-translation')

    await expect(page).toHaveTitle(/Demain, dès l’aube.*Belletra/)
    await expect(page.getByRole('heading', { name: 'A journey whose destination changes everything' })).toBeVisible()
    await expect(page.getByRole('region', { name: 'Victor Hugo poem and English translation' })).toContainText('Un bouquet de houx vert et de bruyère en fleur.')
    await expect(page.getByRole('heading', { name: 'Sources and limits' })).toBeVisible()

    const productLinks = page.locator('a[href*="utm_campaign=demain_des_laube"]')
    await expect(productLinks).toHaveCount(3)
    for (const link of await productLinks.all()) {
      await expect(link).toHaveAttribute('href', /utm_source=seo.*utm_medium=organic.*utm_campaign=demain_des_laube/)
    }
  })
})
