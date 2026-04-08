/**
 * Admin Routes
 *
 * GET   /admin/applications           — list all applications (filterable by status)
 * PATCH /admin/applications/:id       — approve or reject an application
 */

import { Hono } from 'hono'
import { HTTP_STATUS } from '@handy-man/shared/constants'
import { reviewApplicationSchema } from '@handy-man/shared/validators'
import { authenticate, requireRole } from '../../middleware/auth.middleware'
import { validateRequest } from '../../middleware/validation.middleware'
import { listApplications, reviewApplication } from '../../services/professionals/professional.service'
import type { ReviewApplicationInput } from '@handy-man/shared/validators'

const router = new Hono()

// All admin routes require ADMIN role
router.use('*', authenticate, requireRole('ADMIN'))

// GET /admin/applications?status=PENDING
router.get('/applications', async (c) => {
  const status = c.req.query('status')
  const result = await listApplications(status)
  return c.json(result)
})

// PATCH /admin/applications/:id
router.patch(
  '/applications/:id',
  validateRequest(reviewApplicationSchema),
  async (c) => {
    const adminUserId = c.get('userId')
    const applicationId = c.req.param('id')
    const input = c.get('validated') as ReviewApplicationInput

    const result = await reviewApplication(applicationId, adminUserId, input)

    if (!result.success) {
      const status =
        result.code === 'NOT_FOUND' ? HTTP_STATUS.NOT_FOUND : HTTP_STATUS.BAD_REQUEST
      return c.json({ success: false, error: result.error, code: result.code }, status)
    }

    return c.json({ success: true, application: result.application })
  }
)

export default router
