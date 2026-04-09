/**
 * Test Helpers Route — NON-PRODUCTION ONLY
 * POST /test/verify-user
 *
 * Allows automated tests to bypass email verification without a real inbox.
 * Blocked at runtime in production regardless of how the server was started.
 */

import { Hono } from 'hono'
import { supabase } from '../../lib/supabase/client'

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

  const { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .maybeSingle()

  if (!user) {
    return c.json({ success: false, error: 'User not found' }, 404)
  }

  await supabase
    .from('users')
    .update({ is_email_verified: true, email_verified_at: new Date().toISOString() })
    .eq('email', email)

  return c.json({ success: true, message: 'User verified' })
})

export default router
