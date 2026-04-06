/**
 * Current User Route
 * GET /auth/me
 */

import { Hono } from 'hono'
import { HTTP_STATUS } from '@handy-man/shared/constants'
import { authenticate } from '../../middleware/auth.middleware'
import { prisma } from '../../lib/prisma/client'

const router = new Hono()

router.get('/', authenticate, async (c) => {
  const userId = c.get('userId')

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      phone: true,
      firstName: true,
      lastName: true,
      role: true,
      registrationMethod: true,
      isEmailVerified: true,
      isPhoneVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  if (!user) {
    return c.json(
      { success: false, error: 'User not found', code: 'USER_NOT_FOUND' },
      HTTP_STATUS.NOT_FOUND
    )
  }

  return c.json({ success: true, user })
})

export default router
