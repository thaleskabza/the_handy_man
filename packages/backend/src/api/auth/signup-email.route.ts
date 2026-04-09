/**
 * Email Signup Route
 * POST /auth/signup/email
 */

import { Hono } from 'hono'
import { signupEmailSchema } from '@handy-man/shared/validators'
import { HTTP_STATUS } from '@handy-man/shared/constants'
import { validateRequest } from '../../middleware/validation.middleware'
import { signupRateLimiter } from '../../middleware/rate-limit.middleware'
import { signupWithEmail } from '../../services/auth/signup.service'
import type { SignupEmailInput } from '@handy-man/shared/validators'

const router = new Hono()

router.post(
  '/',
  signupRateLimiter,
  validateRequest(signupEmailSchema),
  async (c) => {
    const validated = c.get('validated') as SignupEmailInput

    const result = await signupWithEmail(validated)

    if (!result.success) {
      const status =
        result.code === 'EMAIL_EXISTS' ? HTTP_STATUS.CONFLICT : HTTP_STATUS.BAD_REQUEST

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
        message: 'Registration successful. Please check your email to verify your account.',
        userId: result.userId,
      },
      HTTP_STATUS.CREATED
    )
  }
)

export default router
