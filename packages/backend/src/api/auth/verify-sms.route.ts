/**
 * SMS Verification Route
 * POST /auth/verify/sms
 */

import { Hono } from 'hono'
import { verifySmsSchema } from '@handy-man/shared/validators'
import { HTTP_STATUS } from '@handy-man/shared/constants'
import { validateRequest } from '../../middleware/validation.middleware'
import { verificationRateLimiter } from '../../middleware/rate-limit.middleware'
import { verifySms } from '../../services/auth/verification.service'

const router = new Hono()

router.post(
  '/',
  verificationRateLimiter,
  validateRequest(verifySmsSchema),
  async (c) => {
    const { phone, code } = c.get('validated')

    const result = await verifySms(phone, code)

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
      message: 'Phone verified successfully',
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    })
  }
)

export default router
