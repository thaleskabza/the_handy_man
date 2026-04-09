/**
 * Email Verification Route
 * POST /auth/verify/email
 */

import { Hono } from 'hono'
import { verifyEmailSchema } from '@handy-man/shared/validators'
import { HTTP_STATUS } from '@handy-man/shared/constants'
import { validateRequest } from '../../middleware/validation.middleware'
import { verificationRateLimiter } from '../../middleware/rate-limit.middleware'
import { verifyEmail } from '../../services/auth/verification.service'

const router = new Hono()

router.post(
  '/',
  verificationRateLimiter,
  validateRequest(verifyEmailSchema),
  async (c) => {
    const { token } = c.get('validated') as import('@handy-man/shared/validators').VerifyEmailInput

    const result = await verifyEmail(token)

    if (!result.success) {
      return c.json(
        {
          success: false,
          error: result.error,
          code: result.code,
        },
        HTTP_STATUS.BAD_REQUEST
      )
    }

    return c.json({
      success: true,
      message: 'Email verified successfully',
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    })
  }
)

export default router
