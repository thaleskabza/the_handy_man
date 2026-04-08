import { test, expect } from '@playwright/test'
import { AuthAgent } from '../../agents/auth.agent'

test.describe('Reviews API — unauthenticated', () => {
  test('POST /reviews returns 401 without token', async ({ request }) => {
    const res = await request.post('/reviews', {
      data: { bookingId: 'fake', overallRating: 5 },
    })
    expect(res.status()).toBe(401)
  })

  test('GET /reviews/professional/:id returns 200 with empty array for unknown id', async ({ request }) => {
    const res = await request.get('/reviews/professional/nonexistent-id')
    expect(res.status()).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(Array.isArray(body.reviews)).toBe(true)
  })
})

test.describe('Reviews API — validation', () => {
  let accessToken: string

  test.beforeAll(async ({ request }) => {
    const auth = new AuthAgent(request)
    const email = `review-test+${Date.now()}@handyman-test.com`
    await auth.signupEmail({
      email,
      password: 'Secure@Pass1',
      firstName: 'Review',
      lastName: 'Tester',
      acceptedTerms: true,
      acceptedPrivacy: true,
    })
    await auth.verifyForTest(email)
    const loginRes = await auth.login({ email, password: 'Secure@Pass1' })
    const body = await loginRes.json()
    accessToken = body.accessToken
  })

  test('POST /reviews returns 422 for missing bookingId', async ({ request }) => {
    const res = await request.post('/reviews', {
      data: { overallRating: 5 },
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    expect(res.status()).toBe(422)
  })

  test('POST /reviews returns 422 for rating out of range', async ({ request }) => {
    const res = await request.post('/reviews', {
      data: { bookingId: 'some-id', overallRating: 6 },
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    expect(res.status()).toBe(422)
  })

  test('POST /reviews returns 404 for non-existent booking', async ({ request }) => {
    const res = await request.post('/reviews', {
      data: { bookingId: 'does-not-exist', overallRating: 5 },
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    expect(res.status()).toBe(404)
  })
})
