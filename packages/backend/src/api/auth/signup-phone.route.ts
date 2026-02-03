/**
 * Phone Signup Route
 * POST /auth/signup/phone
 */

import { Hono } from 'hono'
import { signupPhoneSchema } from '@handy-man/shared/validators'
import { HTTP_STATUS } from '@handy-man/shared/constants'
import { validateRequest } from '../../middleware/validation.middleware'
import { signupRateLimiter } from '../../middleware/rate-limit.middleware'
import { signupWithPhone } from '../../services/auth/signup.service'

const router = new Hono()

router.post(
  '/',
  signupRateLimiter,
  validateRequest(signupPhoneSchema),
  async (c) => {
    const validated = c.get('validated')

    const result = await signupWithPhone(validated)

    if (!result.success) {
      const status =
        result.code === 'PHONE_EXISTS' ? HTTP_STATUS.CONFLICT : HTTP_STATUS.BAD_REQUEST

      return c.json(
        {
          success: false,
          error: result.error,
          code: result.code,
        },
        status
      )
    }

    return c.json(
      {
        success: true,
        message: 'Verification code sent to your phone.',
        userId: result.userId,
      },
      HTTP_STATUS.CREATED
    )
  }
)

export default router
