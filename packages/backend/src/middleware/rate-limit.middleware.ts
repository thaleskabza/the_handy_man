/**
 * Rate Limiting Middleware
 * Uses Redis for distributed rate limiting
 */

import type { Context, Next } from 'hono'
import { getRedisClient } from '../lib/redis/client'
import { HTTP_STATUS } from '@handy-man/shared/constants'

interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Max requests per window
  keyPrefix: string // Redis key prefix
}

export function createRateLimiter(config: RateLimitConfig) {
  const { windowMs, maxRequests, keyPrefix } = config

  return async (c: Context, next: Next) => {
    const redis = getRedisClient()
    const ip = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown'
    const key = `${keyPrefix}:${ip}`

    try {
      const current = await redis.incr(key)

      if (current === 1) {
        await redis.pexpire(key, windowMs)
      }

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

      // Add rate limit headers
      c.header('X-RateLimit-Limit', String(maxRequests))
      c.header('X-RateLimit-Remaining', String(Math.max(0, maxRequests - current)))

      await next()
    } catch (error) {
      // Fail open - allow request if Redis is unavailable
      console.error('Rate limiter error:', error)
      await next()
    }
  }
}

// Pre-configured rate limiters
export const signupRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 5,
  keyPrefix: 'ratelimit:signup',
})

export const verificationRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5,
  keyPrefix: 'ratelimit:verify',
})
