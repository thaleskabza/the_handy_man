import { test, expect } from '@playwright/test'
import { HealthAgent } from '../../agents/health.agent'

test.describe('GET /health', () => {
  test('returns 200 with status ok', async ({ request }) => {
    const agent = new HealthAgent(request)
    const res = await agent.getHealth()

    expect(res.status()).toBe(200)
    const body = await res.json()
    expect(body.status).toBe('ok')
  })

  test('response includes a timestamp', async ({ request }) => {
    const agent = new HealthAgent(request)
    const res = await agent.getHealth()
    const body = await res.json()

    expect(body.timestamp).toBeDefined()
    expect(new Date(body.timestamp).toISOString()).toBe(body.timestamp)
  })
})
