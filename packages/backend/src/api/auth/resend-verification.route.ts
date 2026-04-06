/**
 * Resend Verification Routes
 * POST /auth/resend/email
 * POST /auth/resend/sms
 */

import { Hono } from 'hono'
import { resendEmailSchema, resendSmsSchema } from '@handy-man/shared/validators'
import { HTTP_STATUS } from '@handy-man/shared/constants'
import { validateRequest } from '../../middleware/validation.middleware'
import { verificationRateLimiter } from '../../middleware/rate-limit.middleware'
import {
  resendEmailVerification,
  resendSmsVerification,
} from '../../services/auth/resend-verification.service'

const router = new Hono()

router.post('/email', verificationRateLimiter, validateRequest(resendEmailSchema), async (c) => {
  const { email } = c.get('validated') as import('@handy-man/shared/validators').ResendEmailInput

  const result = await resendEmailVerification(email)

  if (!result.success) {
    return c.json(
      { success: false, error: result.error, code: result.code },
      HTTP_STATUS.BAD_REQUEST
    )
  }

  return c.json({ success: true, message: 'Verification email sent.' })
})

router.post('/sms', verificationRateLimiter, validateRequest(resendSmsSchema), async (c) => {
  const { phone } = c.get('validated') as import('@handy-man/shared/validators').ResendSmsInput

  const result = await resendSmsVerification(phone)

  if (!result.success) {
    return c.json(
      { success: false, error: result.error, code: result.code },
      HTTP_STATUS.BAD_REQUEST
    )
  }

  return c.json({ success: true, message: 'Verification code sent.' })
})

export default router
