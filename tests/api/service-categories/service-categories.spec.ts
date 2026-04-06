import { test, expect } from '@playwright/test'
import { ServiceCategoriesAgent } from '../../agents/service-categories.agent'

test.describe('GET /service-categories', () => {
  test('returns 200 with categories array', async ({ request }) => {
    const agent = new ServiceCategoriesAgent(request)
    const res = await agent.getAll()

    expect(res.status()).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(Array.isArray(body.categories)).toBe(true)
  })

  test('each category has required fields', async ({ request }) => {
    const agent = new ServiceCategoriesAgent(request)
    const res = await agent.getAll()
    const body = await res.json()

    if (body.categories.length > 0) {
      const category = body.categories[0]
      expect(category).toHaveProperty('id')
      expect(category).toHaveProperty('name')
      expect(category).toHaveProperty('slug')
      expect(category).toHaveProperty('basePrice')
    }
  })
})

test.describe('GET /service-categories/:slug', () => {
  test('returns 404 for unknown slug', async ({ request }) => {
    const agent = new ServiceCategoriesAgent(request)
    const res = await agent.getBySlug('this-does-not-exist')

    expect(res.status()).toBe(404)
    const body = await res.json()
    expect(body.success).toBe(false)
  })

  test('returns 200 for seeded plumbing category', async ({ request }) => {
    const agent = new ServiceCategoriesAgent(request)

    // Check if the category exists first
    const listRes = await agent.getAll()
    const { categories } = await listRes.json()
    const plumbing = categories.find((c: { slug: string }) => c.slug === 'plumbing')

    if (!plumbing) {
      test.skip()
      return
    }

    const res = await agent.getBySlug('plumbing')
    expect(res.status()).toBe(200)
    const body = await res.json()
    expect(body.category.slug).toBe('plumbing')
  })
})

test.describe('POST /service-categories (admin only)', () => {
  test('returns 401 without auth token', async ({ request }) => {
    const agent = new ServiceCategoriesAgent(request)
    const res = await agent.create(
      { name: 'Test Service', slug: 'test-service', basePrice: 500 },
      ''
    )
    expect(res.status()).toBe(401)
  })
})
