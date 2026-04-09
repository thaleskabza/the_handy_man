/**
 * Validation Middleware
 * Validates request body against Zod schemas
 */

import type { Context, Next } from 'hono'
import { HTTP_STATUS } from '@handy-man/shared/constants'

type ZodIssue = { path: (string | number)[]; message: string }
type ZodLikeError = { issues: ZodIssue[] }
type ZodLikeSchema<T> = { parse(data: unknown): T }

export function validateRequest<T>(schema: ZodLikeSchema<T>) {
  return async (c: Context, next: Next) => {
    try {
      const body = await c.req.json()
      const validated = schema.parse(body)

      // Store validated data for route handler
      c.set('validated', validated)

      await next()
    } catch (error) {
      if (error && typeof error === 'object' && 'issues' in error) {
        const zodError = error as ZodLikeError
        const details: Record<string, string[]> = {}

        zodError.issues.forEach((issue: ZodIssue) => {
          const path = issue.path.join('.')
          if (!details[path]) {
            details[path] = []
          }
          details[path].push(issue.message)
        })

        return c.json(
          {
            success: false,
            error: 'Validation failed',
            code: 'VALIDATION_ERROR',
            details,
          },
          HTTP_STATUS.UNPROCESSABLE_ENTITY
        )
      }

      return c.json(
        {
          success: false,
          error: 'Invalid request body',
          code: 'VALIDATION_ERROR',
        },
        HTTP_STATUS.UNPROCESSABLE_ENTITY
      )
    }
  }
}
