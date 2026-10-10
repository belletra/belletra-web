import { test, expect } from '@playwright/test'

const STORAGE_KEY = 'belletra_first_touch_v1'

test.describe('First-touch acquisition', () => {
  test('captures a complete tagged campaign once', async ({ page }) => {
    await page.goto('/?utm_source=reddit&utm_medium=organic&utm_campaign=verlaine_readers')

    const firstTouch = await page.evaluate(key => {
      const value = localStorage.getItem(key)
      return value ? JSON.parse(value) : null
    }, STORAGE_KEY)

    expect(firstTouch).toMatchObject({
      source: 'reddit',
      medium: 'organic',
      campaign: 'verlaine_readers',
      landing_path: '/',
    })
    expect(Date.parse(firstTouch.captured_at)).not.toBeNaN()

    await page.goto('/?utm_source=second&utm_medium=paid&utm_campaign=overwrite_attempt')
    const retained = await page.evaluate(key => JSON.parse(localStorage.getItem(key) ?? 'null'), STORAGE_KEY)
    expect(retained).toEqual(firstTouch)
  })

  test('ignores incomplete campaign tags', async ({ page }) => {
    await page.goto('/?utm_source=reddit&utm_campaign=missing_medium')
    await expect.poll(() => page.evaluate(key => localStorage.getItem(key), STORAGE_KEY)).toBeNull()
  })

  test('sanitizes stored campaign values', async ({ page }) => {
    await page.goto('/?utm_source=community%20post&utm_medium=organic&utm_campaign=poetry%26prose')
    const firstTouch = await page.evaluate(key => JSON.parse(localStorage.getItem(key) ?? 'null'), STORAGE_KEY)

    expect(firstTouch).toMatchObject({
      source: 'community_post',
      medium: 'organic',
      campaign: 'poetry_prose',
      landing_path: '/',
    })
  })
})
