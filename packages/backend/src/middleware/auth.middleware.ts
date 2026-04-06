/**
 * Auth Middleware
 * JWT verification and role-based authorization
 */

import type { Context, Next } from 'hono'
import { HTTP_STATUS } from '@handy-man/shared/constants'
import { verifyToken } from '../services/auth/token.service'
import { prisma } from '../lib/prisma/client'

declare module 'hono' {
  interface ContextVariableMap {
    userId: string
    userRole: string
    validated: unknown
  }
}

export async function authenticate(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization')

  if (!authHeader?.startsWith('Bearer ')) {
    return c.json(
      { success: false, error: 'Authentication required', code: 'UNAUTHORIZED' },
      HTTP_STATUS.UNAUTHORIZED
    )
  }

  const token = authHeader.slice(7)
  const payload = await verifyToken(token)

  if (!payload) {
    return c.json(
      { success: false, error: 'Invalid or expired token', code: 'INVALID_TOKEN' },
      HTTP_STATUS.UNAUTHORIZED
    )
  }

  // Verify user still exists and is active
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, role: true },
  })

  if (!user) {
    return c.json(
      { success: false, error: 'User not found', code: 'USER_NOT_FOUND' },
      HTTP_STATUS.UNAUTHORIZED
    )
  }

  c.set('userId', user.id)
  c.set('userRole', user.role)

  await next()
}

export function requireRole(...roles: string[]) {
  return async (c: Context, next: Next) => {
    const userRole = c.get('userRole')

    if (!roles.includes(userRole)) {
      return c.json(
        { success: false, error: 'Insufficient permissions', code: 'FORBIDDEN' },
        HTTP_STATUS.FORBIDDEN
      )
    }

    await next()
  }
}
