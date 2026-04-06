import { test, expect } from '@playwright/test'
import { BookingsAgent } from '../../agents/bookings.agent'
import { AuthAgent } from '../../agents/auth.agent'

test.describe('Bookings API — unauthenticated', () => {
  test('GET /bookings returns 401 without token', async ({ request }) => {
    const agent = new BookingsAgent(request)
    const res = await agent.getAll('')
    expect(res.status()).toBe(401)
  })

  test('POST /bookings returns 401 without token', async ({ request }) => {
    const agent = new BookingsAgent(request)
    const res = await agent.create(
      {
        serviceCategoryId: 'cat-1',
        addressId: 'addr-1',
        scheduledDate: '2026-07-01',
        scheduledTimeStart: '09:00',
      },
      ''
    )
    expect(res.status()).toBe(401)
  })

  test('GET /bookings/addresses returns 401 without token', async ({ request }) => {
    const agent = new BookingsAgent(request)
    const res = await agent.getAddresses('')
    expect(res.status()).toBe(401)
  })
})

test.describe('Bookings API — authenticated client', () => {
  let accessToken: string
  let createdAddressId: string

  test.beforeAll(async ({ request }) => {
    const authAgent = new AuthAgent(request)
    const email = `booking-test+${Date.now()}@handyman-test.com`

    await authAgent.signupEmail({
      email,
      password: 'Secure@Pass1',
      firstName: 'Booking',
      lastName: 'Tester',
      acceptedTerms: true,
      acceptedPrivacy: true,
    })

    // Bypass email verification via test helper
    const verifyRes = await authAgent.verifyForTest(email)
    if (verifyRes.status() !== 200) {
      throw new Error('Test verify endpoint failed — is the backend running with NODE_ENV != production?')
    }

    const loginRes = await authAgent.login({ email, password: 'Secure@Pass1' })
    const loginBody = await loginRes.json()
    accessToken = loginBody.accessToken
  })

  test('GET /bookings returns empty array for new client', async ({ request }) => {
    const agent = new BookingsAgent(request)
    const res = await agent.getAll(accessToken, 'upcoming')

    expect(res.status()).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(Array.isArray(body.bookings)).toBe(true)
    expect(body.bookings).toHaveLength(0)
  })

  test('POST /bookings/addresses creates a new address', async ({ request }) => {
    const agent = new BookingsAgent(request)
    const res = await agent.createAddress(
      {
        label: 'Home',
        addressLine1: '123 Main Street',
        city: 'Johannesburg',
        province: 'Gauteng',
        postalCode: '2001',
      },
      accessToken
    )

    expect(res.status()).toBe(201)
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(body.address.label).toBe('Home')
    createdAddressId = body.address.id
  })

  test('POST /bookings returns 422 for missing required fields', async ({ request }) => {
    const agent = new BookingsAgent(request)
    const res = await agent.create({} as never, accessToken)
    expect(res.status()).toBe(422)
  })

  test('POST /bookings creates a booking with valid payload', async ({ request }) => {
    // Depends on address being created in previous test
    if (!createdAddressId) test.skip()

    // Get seeded service category id
    const catRes = await request.get('/service-categories')
    const { categories } = await catRes.json()
    if (!categories?.length) test.skip()
    const serviceCategoryId = categories[0].id

    const agent = new BookingsAgent(request)
    const res = await agent.create(
      {
        serviceCategoryId,
        addressId: createdAddressId,
        scheduledDate: '2026-08-01',
        scheduledTimeStart: '09:00',
        clientDescription: 'Fix the kitchen sink',
      },
      accessToken
    )

    expect(res.status()).toBe(201)
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(body.booking.bookingReference).toMatch(/^HM-\d{4}-\d{6}$/)
  })
})
