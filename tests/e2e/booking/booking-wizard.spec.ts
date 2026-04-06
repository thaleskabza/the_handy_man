import { test, expect } from '@playwright/test'

test.describe('Booking wizard — unauthenticated', () => {
  test('redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/booking')
    await expect(page).toHaveURL(/\/auth\/login/, { timeout: 5000 })
  })
})

test.describe('Services page', () => {
  test('renders services grid', async ({ page }) => {
    await page.goto('/services')
    // The page should show at least a heading
    await expect(page.getByRole('heading')).toBeVisible({ timeout: 5000 })
  })

  test('clicking Book Now on a service goes to booking wizard', async ({ page }) => {
    await page.goto('/services')
    const bookNowBtn = page.getByRole('link', { name: /book now/i }).first()

    // If there are no categories (unseeded DB), this test auto-skips
    const count = await bookNowBtn.count()
    if (count === 0) {
      test.skip()
      return
    }

    await bookNowBtn.click()
    // Should redirect to login (unauthenticated) or booking wizard
    await expect(page).toHaveURL(/\/(booking|auth\/login)/)
  })
})

test.describe('Bookings list page — unauthenticated', () => {
  test('redirects to login', async ({ page }) => {
    await page.goto('/bookings')
    await expect(page).toHaveURL(/\/auth\/login/, { timeout: 5000 })
  })
})

test.describe('Navigation', () => {
  test('home page loads and nav is visible', async ({ page }) => {
    await page.goto('/')
    const nav = page.locator('nav')
    await expect(nav).toBeVisible({ timeout: 5000 })
  })

  test('nav has Sign In link when not logged in', async ({ page }) => {
    // Clear any stored auth state
    await page.context().clearCookies()
    await page.goto('/')
    await expect(page.getByRole('link', { name: /sign in/i })).toBeVisible({ timeout: 5000 })
  })

  test('services link in nav navigates to /services', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: /services/i }).first().click()
    await expect(page).toHaveURL(/\/services/)
  })
})
