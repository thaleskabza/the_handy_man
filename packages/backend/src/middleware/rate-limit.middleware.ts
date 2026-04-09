/**
 * Rate Limiting Middleware
 * Uses in-memory store for rate limiting
 */

import type { Context, Next } from 'hono'
import { HTTP_STATUS } from '@handy-man/shared/constants'

interface RateLimitConfig {
  windowMs: number
  maxRequests: number
  keyPrefix: string
}

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

export function createRateLimiter(config: RateLimitConfig) {
  const { windowMs, maxRequests, keyPrefix } = config

  return async (c: Context, next: Next) => {
    const ip = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown'
    const key = `${keyPrefix}:${ip}`
    const now = Date.now()

    const entry = store.get(key)

    if (!entry || now > entry.resetAt) {
      store.set(key, { count: 1, resetAt: now + windowMs })
    } else {
      entry.count++
    }

    const current = store.get(key)!.count

    if (current > maxRequests) {
      return c.json(
        {
          success: false,
          error: 'Too many requests. Please try again later.',
          code: 'RATE_LIMITED',
        },
        HTTP_STATUS.TOO_MANY_REQUESTS
      )
    }

    c.header('X-RateLimit-Limit', String(maxRequests))
    c.header('X-RateLimit-Remaining', String(Math.max(0, maxRequests - current)))

    await next()
  }
}

export const signupRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: process.env.NODE_ENV === 'development' ? 1000 : 5,
  keyPrefix: 'ratelimit:signup',
})

export const verificationRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5,
  keyPrefix: 'ratelimit:verify',
})
