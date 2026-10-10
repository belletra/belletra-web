/**
 * Auth setup — logs in once and saves storage state for all tests that need it.
 * Run via: test.use({ storageState: 'e2e/.auth/user.json' })
 */
import { test as setup } from '@playwright/test'
import path from 'path'

const authFile = path.join(__dirname, '.auth/user.json')

setup('authenticate', async ({ page }) => {
  const email = process.env.BELLETRA_TEST_EMAIL || 'test-playwright@belletra.app'
  const password = process.env.BELLETRA_TEST_PASSWORD || 'Playwright!2026'

  await page.goto('/login')
  await page.locator('.auth-input[type="email"]').fill(email)
  await page.locator('.auth-input[type="password"]').fill(password)
  await page.locator('.auth-btn-primary').click()
  await page.waitForURL(/\/app/, { timeout: 15_000 })

  await page.context().storageState({ path: authFile })
})
