import { test, expect } from '@playwright/test'
import { AuthAgent } from '../../agents/auth.agent'

test.describe('POST /auth/login', () => {
  test('returns 401 for non-existent user', async ({ request }) => {
    const agent = new AuthAgent(request)
    const res = await agent.login({
      email: 'nobody@handyman-test.com',
      password: 'Secure@Pass1',
    })

    expect(res.status()).toBe(401)
    const body = await res.json()
    expect(body.success).toBe(false)
    expect(body.code).toBe('INVALID_CREDENTIALS')
  })

  test('returns 401 for wrong password', async ({ request }) => {
    const agent = new AuthAgent(request)

    // Sign up first
    const email = `login-test+${Date.now()}@handyman-test.com`
    await agent.signupEmail({
      email,
      password: 'Secure@Pass1',
      firstName: 'Login',
      lastName: 'Test',
      acceptedTerms: true,
      acceptedPrivacy: true,
    })

    const res = await agent.login({ email, password: 'WrongPassword!' })
    expect(res.status()).toBe(401)
    const body = await res.json()
    expect(body.code).toBe('INVALID_CREDENTIALS')
  })

  test('returns 403 for unverified email', async ({ request }) => {
    const agent = new AuthAgent(request)

    const email = `unverified+${Date.now()}@handyman-test.com`
    await agent.signupEmail({
      email,
      password: 'Secure@Pass1',
      firstName: 'Unverified',
      lastName: 'User',
      acceptedTerms: true,
      acceptedPrivacy: true,
    })

    // Login before verifying email
    const res = await agent.login({ email, password: 'Secure@Pass1' })
    expect(res.status()).toBe(403)
    const body = await res.json()
    expect(body.code).toBe('EMAIL_NOT_VERIFIED')
  })

  test('returns 422 when neither email nor phone provided', async ({ request }) => {
    const agent = new AuthAgent(request)
    const res = await agent.login({ password: 'Secure@Pass1' })
    expect(res.status()).toBe(422)
  })
})

test.describe('POST /auth/refresh', () => {
  test('returns 401 for invalid refresh token', async ({ request }) => {
    const agent = new AuthAgent(request)
    const res = await agent.refresh('invalid-token-string')
    expect(res.status()).toBe(401)
    const body = await res.json()
    expect(body.success).toBe(false)
  })
})

test.describe('GET /auth/me', () => {
  test('returns 401 without Authorization header', async ({ request }) => {
    const agent = new AuthAgent(request)
    const res = await agent.me('')
    expect(res.status()).toBe(401)
  })

  test('returns 401 with invalid token', async ({ request }) => {
    const agent = new AuthAgent(request)
    const res = await agent.me('Bearer not.a.real.token')
    expect(res.status()).toBe(401)
  })
})
