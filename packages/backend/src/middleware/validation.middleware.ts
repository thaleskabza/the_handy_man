/**
 * Validation Middleware
 * Validates request body against Zod schemas
 */

import type { Context, Next } from 'hono'
import type { ZodSchema, ZodError } from 'zod'
import { HTTP_STATUS } from '@handy-man/shared/constants'

export function validateRequest<T>(schema: ZodSchema<T>) {
  return async (c: Context, next: Next) => {
    try {
      const body = await c.req.json()
      const validated = schema.parse(body)

      // Store validated data for route handler
      c.set('validated', validated)

      await next()
    } catch (error) {
      if ((error as ZodError).issues) {
        const zodError = error as ZodError
        const details: Record<string, string[]> = {}

        zodError.issues.forEach((issue) => {
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
