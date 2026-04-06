/**
 * Forgot Password Route
 * POST /auth/forgot-password
 */

import { Hono } from 'hono'
import { forgotPasswordSchema } from '@handy-man/shared/validators'
import { validateRequest } from '../../middleware/validation.middleware'
import { createRateLimiter } from '../../middleware/rate-limit.middleware'
import { forgotPassword } from '../../services/auth/password-reset.service'

const router = new Hono()

const forgotPasswordRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 3,
  keyPrefix: 'ratelimit:forgot-password',
})

router.post('/', forgotPasswordRateLimiter, validateRequest(forgotPasswordSchema), async (c) => {
  const { email } = c.get('validated') as import('@handy-man/shared/validators').ForgotPasswordInput

  await forgotPassword(email)

  // Always respond with success to prevent email enumeration
  return c.json({
    success: true,
    message: 'If an account exists with that email, a reset link has been sent.',
  })
})

export default router
