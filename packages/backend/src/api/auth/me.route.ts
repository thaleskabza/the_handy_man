/**
 * Current User Route
 * GET /auth/me
 */

import { Hono } from 'hono'
import { HTTP_STATUS } from '@handy-man/shared/constants'
import { authenticate } from '../../middleware/auth.middleware'
import { supabase } from '../../lib/supabase/client'

const router = new Hono()

router.get('/', authenticate, async (c) => {
  const userId = c.get('userId')

  const { data: user } = await supabase
    .from('users')
    .select('id, email, phone, first_name, last_name, role, registration_method, is_email_verified, is_phone_verified, created_at, updated_at')
    .eq('id', userId)
    .maybeSingle()

  if (!user) {
    return c.json(
      { success: false, error: 'User not found', code: 'USER_NOT_FOUND' },
      HTTP_STATUS.NOT_FOUND
    )
  }

  return c.json({ success: true, user })
})

export default router
