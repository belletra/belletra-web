import { test, expect } from '@playwright/test'

const EMAIL = process.env.BELLETRA_TEST_EMAIL || 'test-playwright@belletra.app'
const PASSWORD = process.env.BELLETRA_TEST_PASSWORD || 'Playwright!2026'

test.describe('Auth flows', () => {
  test('login page renders with email + password inputs', async ({ page }) => {
    await page.goto('/login')
    await expect(page.locator('.auth-input').first()).toBeVisible()
    await expect(page.locator('.auth-input')).toHaveCount(2)
  })

  test('wrong password shows error message', async ({ page }) => {
    await page.goto('/login')
    await page.locator('.auth-input[type="email"]').fill(EMAIL)
    await page.locator('.auth-input[type="password"]').fill('wrong-password-xyz')
    await page.locator('.auth-btn-primary').click()
    await expect(page.getByText(/invalid|incorrect|credentials/i)).toBeVisible({ timeout: 8_000 })
  })

  test('forgot password sends reset link', async ({ page }) => {
    await page.goto('/login')
    await page.locator('.auth-input[type="email"]').fill(EMAIL)
    await page.getByText('Forgot password?').click()
    await expect(page.getByText(/reset link sent/i)).toBeVisible({ timeout: 8_000 })
  })

  test('signup page renders', async ({ page }) => {
    await page.goto('/signup')
    await expect(page.locator('.auth-input').first()).toBeVisible()
    await expect(page.locator('.auth-btn-primary')).toBeVisible()
  })

  test('successful login redirects to /app', async ({ page }) => {
    await page.goto('/login')
    await page.locator('.auth-input[type="email"]').fill(EMAIL)
    await page.locator('.auth-input[type="password"]').fill(PASSWORD)
    await page.locator('.auth-btn-primary').click()
    await page.waitForURL(/\/app/, { timeout: 15_000 })
    expect(page.url()).toContain('/app')
  })

  test('sign out redirects away from dashboard', async ({ page }) => {
    await page.goto('/login')
    await page.locator('.auth-input[type="email"]').fill(EMAIL)
    await page.locator('.auth-input[type="password"]').fill(PASSWORD)
    await page.locator('.auth-btn-primary').click()
    await page.waitForURL(/\/app/, { timeout: 15_000 })
    await page.getByText('Sign out').click()
    await expect(page).not.toHaveURL(/\/app$/, { timeout: 8_000 })
  })
})
