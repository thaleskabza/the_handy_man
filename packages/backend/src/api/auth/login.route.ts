/**
 * Login Route
 * POST /auth/login
 */

import { Hono } from 'hono'
import { loginSchema } from '@handy-man/shared/validators'
import { HTTP_STATUS } from '@handy-man/shared/constants'
import { validateRequest } from '../../middleware/validation.middleware'
import { createRateLimiter } from '../../middleware/rate-limit.middleware'
import { login } from '../../services/auth/login.service'

const router = new Hono()

const loginRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 10,
  keyPrefix: 'ratelimit:login',
})

router.post('/', loginRateLimiter, validateRequest(loginSchema), async (c) => {
  const validated = c.get('validated') as import('@handy-man/shared/validators').LoginInput

  const result = await login(validated)

  if (!result.success) {
    const status =
      result.code === 'EMAIL_NOT_VERIFIED' || result.code === 'PHONE_NOT_VERIFIED'
        ? HTTP_STATUS.FORBIDDEN
        : HTTP_STATUS.UNAUTHORIZED

    return c.json(
      { success: false, error: result.error, code: result.code },
      status
    )
  }

  return c.json({
    success: true,
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
  })
})

export default router
