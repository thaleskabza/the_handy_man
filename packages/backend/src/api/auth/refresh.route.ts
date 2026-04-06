/**
 * Token Refresh Route
 * POST /auth/refresh
 */

import { Hono } from 'hono'
import { refreshTokenSchema } from '@handy-man/shared/validators'
import { HTTP_STATUS } from '@handy-man/shared/constants'
import { validateRequest } from '../../middleware/validation.middleware'
import { refreshSession } from '../../services/auth/login.service'

const router = new Hono()

router.post('/', validateRequest(refreshTokenSchema), async (c) => {
  const { refreshToken } = c.get('validated') as import('@handy-man/shared/validators').RefreshTokenInput

  const result = await refreshSession(refreshToken)

  if (!result.success) {
    return c.json(
      { success: false, error: result.error, code: result.code },
      HTTP_STATUS.UNAUTHORIZED
    )
  }

  return c.json({
    success: true,
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
  })
})

export default router
