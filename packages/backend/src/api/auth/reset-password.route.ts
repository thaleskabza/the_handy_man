/**
 * Reset Password Route
 * POST /auth/reset-password
 */

import { Hono } from 'hono'
import { resetPasswordSchema } from '@handy-man/shared/validators'
import { HTTP_STATUS } from '@handy-man/shared/constants'
import { validateRequest } from '../../middleware/validation.middleware'
import { resetPassword } from '../../services/auth/password-reset.service'

const router = new Hono()

router.post('/', validateRequest(resetPasswordSchema), async (c) => {
  const { token, password } = c.get('validated') as import('@handy-man/shared/validators').ResetPasswordInput

  const result = await resetPassword(token, password)

  if (!result.success) {
    return c.json(
      { success: false, error: result.error, code: result.code },
      HTTP_STATUS.BAD_REQUEST
    )
  }

  return c.json({ success: true, message: 'Password reset successfully. Please log in.' })
})

export default router
