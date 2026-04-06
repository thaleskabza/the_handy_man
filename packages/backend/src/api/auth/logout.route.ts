/**
 * Logout Route
 * POST /auth/logout
 */

import { Hono } from 'hono'
import { logoutSchema } from '@handy-man/shared/validators'
import { validateRequest } from '../../middleware/validation.middleware'
import { logout } from '../../services/auth/login.service'

const router = new Hono()

router.post('/', validateRequest(logoutSchema), async (c) => {
  const { refreshToken } = c.get('validated') as import('@handy-man/shared/validators').LogoutInput

  await logout(refreshToken)

  return c.json({ success: true, message: 'Logged out successfully' })
})

export default router
