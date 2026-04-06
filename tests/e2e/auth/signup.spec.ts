import { test, expect } from '@playwright/test'

const uniqueEmail = () => `e2e+${Date.now()}@handyman-test.com`

test.describe('Signup flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/signup')
  })

  test('signup page renders required fields', async ({ page }) => {
    await expect(page.getByLabel(/first name/i)).toBeVisible()
    await expect(page.getByLabel(/last name/i)).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/password/i).first()).toBeVisible()
  })

  test('shows validation errors for empty form submission', async ({ page }) => {
    await page.getByRole('button', { name: /create account|sign up/i }).click()
    // At least one error message should appear
    const errors = page.locator('[class*="error"], [class*="text-red"]')
    await expect(errors.first()).toBeVisible({ timeout: 3000 })
  })

  test('shows error for mismatched passwords', async ({ page }) => {
    await page.getByLabel(/first name/i).fill('Test')
    await page.getByLabel(/last name/i).fill('User')
    await page.getByLabel(/email/i).fill(uniqueEmail())

    const passwordFields = page.getByLabel(/password/i)
    await passwordFields.nth(0).fill('Secure@Pass1')
    await passwordFields.nth(1).fill('DifferentPass1!')

    await page.getByRole('button', { name: /create account|sign up/i }).click()
    await expect(page.getByText(/passwords do not match/i)).toBeVisible({ timeout: 3000 })
  })

  test('navigates to login page via sign in link', async ({ page }) => {
    await page.getByRole('link', { name: /sign in|log in/i }).click()
    await expect(page).toHaveURL(/\/auth\/login/)
  })
})

test.describe('Login flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login')
  })

  test('login page renders email and password fields', async ({ page }) => {
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/password/i)).toBeVisible()
  })

  test('shows error for invalid credentials', async ({ page }) => {
    await page.getByLabel(/email/i).fill('nobody@example.com')
    await page.getByLabel(/password/i).fill('WrongPassword')
    await page.getByRole('button', { name: /sign in|log in/i }).click()

    await expect(
      page.getByText(/invalid credentials|incorrect|not found/i)
    ).toBeVisible({ timeout: 5000 })
  })

  test('navigates to signup page via create account link', async ({ page }) => {
    await page.getByRole('link', { name: /create account|sign up/i }).click()
    await expect(page).toHaveURL(/\/auth\/signup/)
  })

  test('navigates to forgot password page', async ({ page }) => {
    await page.getByRole('link', { name: /forgot|reset password/i }).click()
    await expect(page).toHaveURL(/\/auth\/forgot-password/)
  })
})
