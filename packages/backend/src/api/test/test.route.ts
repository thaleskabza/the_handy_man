/**
 * Test Helpers Route — NON-PRODUCTION ONLY
 * POST /test/verify-user
 *
 * Allows automated tests to bypass email verification without a real inbox.
 * Blocked at runtime in production regardless of how the server was started.
 */

import { Hono } from 'hono'
import { prisma } from '../../lib/prisma/client'

const router = new Hono()

router.post('/verify-user', async (c) => {
  if (process.env.NODE_ENV === 'production') {
    return c.json({ success: false, error: 'Not found' }, 404)
  }

  const body = await c.req.json().catch(() => ({}))
  const { email } = body as { email?: string }

  if (!email) {
    return c.json({ success: false, error: 'email is required' }, 422)
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    return c.json({ success: false, error: 'User not found' }, 404)
  }

  await prisma.user.update({
    where: { email },
    data: { isEmailVerified: true, emailVerifiedAt: new Date() },
  })

  return c.json({ success: true, message: 'User verified' })
})

export default router
