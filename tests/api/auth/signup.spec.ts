import { test, expect } from '@playwright/test'
import { AuthAgent } from '../../agents/auth.agent'

const uniqueEmail = () => `test+${Date.now()}@handyman-test.com`

test.describe('POST /auth/signup/email', () => {
  test('returns 201 for valid signup', async ({ request }) => {
    const agent = new AuthAgent(request)
    const res = await agent.signupEmail({
      email: uniqueEmail(),
      password: 'Secure@Pass1',
      firstName: 'Test',
      lastName: 'User',
      acceptedTerms: true,
      acceptedPrivacy: true,
    })

    expect(res.status()).toBe(201)
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(body.userId).toBeDefined()
  })

  test('returns 409 when email already registered', async ({ request }) => {
    const agent = new AuthAgent(request)
    const email = uniqueEmail()
    const payload = {
      email,
      password: 'Secure@Pass1',
      firstName: 'Test',
      lastName: 'User',
      acceptedTerms: true,
      acceptedPrivacy: true,
    }

    // First signup
    await agent.signupEmail(payload)

    // Duplicate signup
    const res = await agent.signupEmail(payload)
    expect(res.status()).toBe(409)
    const body = await res.json()
    expect(body.success).toBe(false)
    expect(body.code).toBe('EMAIL_EXISTS')
  })

  test('returns 422 for invalid email format', async ({ request }) => {
    const agent = new AuthAgent(request)
    const res = await agent.signupEmail({
      email: 'not-an-email',
      password: 'Secure@Pass1',
      firstName: 'Test',
      lastName: 'User',
      acceptedTerms: true,
      acceptedPrivacy: true,
    })

    expect(res.status()).toBe(422)
  })

  test('returns 422 when terms not accepted', async ({ request }) => {
    const agent = new AuthAgent(request)
    const res = await agent.signupEmail({
      email: uniqueEmail(),
      password: 'Secure@Pass1',
      firstName: 'Test',
      lastName: 'User',
      acceptedTerms: false,
      acceptedPrivacy: true,
    })

    expect(res.status()).toBe(422)
  })
})
