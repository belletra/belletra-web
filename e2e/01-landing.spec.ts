import { test, expect } from '@playwright/test'

test.describe('Landing page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('loads and shows hero CTA', async ({ page }) => {
    await expect(page.locator('.bl-hero-cta')).toBeVisible()
  })

  test('page title contains Belletra', async ({ page }) => {
    await expect(page).toHaveTitle(/belletra/i)
  })

  test('shows Start free and Log in CTAs', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 })
    await expect(page.getByRole('banner').getByRole('link', { name: 'Start free' })).toBeVisible()
    await expect(page.locator('.bl-nav-login')).toBeVisible()
  })

  test('nav section links visible', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 })
    const nav = page.getByRole('navigation')
    await expect(nav.getByRole('link', { name: 'Features' })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'The method' })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Pricing' })).toBeVisible()
  })

  test('Start free links to /signup', async ({ page }) => {
    await expect(page.locator('.bl-hero-cta')).toHaveAttribute('href', /signup/)
  })

  test('Log in links to /login', async ({ page }) => {
    await expect(page.locator('.bl-nav-login')).toHaveAttribute('href', /login/)
  })

  test('dark mode toggle switches theme', async ({ page }) => {
    const toggle = page.locator('[aria-label="toggle light and dark"]')
    const landing = page.locator('[data-mode]').first()
    await toggle.click()
    await expect(landing).toHaveAttribute('data-mode', 'dark')
    await toggle.click()
    await expect(landing).toHaveAttribute('data-mode', 'light')
  })

  test('mobile: Log in nav link is hidden', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await expect(page.locator('.bl-nav-login')).toBeHidden()
  })

  test('hero CTA visible at all breakpoints', async ({ page }) => {
    for (const [w, h] of [[390, 844], [768, 1024], [1440, 900]]) {
      await page.setViewportSize({ width: w, height: h })
      await expect(page.locator('.bl-hero-cta')).toBeVisible()
    }
  })
})
