/**
 * Reviews Routes
 * POST   /reviews                         — client submits a review
 * GET    /reviews/professional/:id        — public: get a professional's reviews
 * POST   /reviews/:id/response            — professional responds to a review
 */

import { Hono } from 'hono'
import { HTTP_STATUS } from '@handy-man/shared/constants'
import { createReviewSchema, professionalResponseSchema } from '@handy-man/shared/validators'
import { authenticate, requireRole } from '../../middleware/auth.middleware'
import { validateRequest } from '../../middleware/validation.middleware'
import {
  createReview,
  getProfessionalReviews,
  addProfessionalResponse,
} from '../../services/reviews/review.service'

const router = new Hono()

// POST /reviews — client submits a review
router.post('/', authenticate, requireRole('CLIENT'), validateRequest(createReviewSchema), async (c) => {
  const userId = c.get('userId')
  const input = c.get('validated') as import('@handy-man/shared/validators').CreateReviewInput

  const result = await createReview(userId, input)
  if (!result.success) {
    const status =
      result.code === 'DUPLICATE' ? HTTP_STATUS.CONFLICT :
      result.code === 'NOT_FOUND' ? HTTP_STATUS.NOT_FOUND :
      HTTP_STATUS.BAD_REQUEST
    return c.json({ success: false, error: result.error, code: result.code }, status)
  }

  return c.json({ success: true, review: result.review }, HTTP_STATUS.CREATED)
})

// GET /reviews/professional/:id — public
router.get('/professional/:id', async (c) => {
  const professionalId = c.req.param('id')
  const page = Number(c.req.query('page') ?? 1)
  const limit = Math.min(Number(c.req.query('limit') ?? 10), 50)

  const result = await getProfessionalReviews(professionalId, page, limit)
  return c.json(result)
})

// POST /reviews/:id/response — professional responds
router.post('/:id/response', authenticate, requireRole('HANDYMAN'), validateRequest(professionalResponseSchema), async (c) => {
  const userId = c.get('userId')
  const reviewId = c.req.param('id')
  const input = c.get('validated') as import('@handy-man/shared/validators').ProfessionalResponseInput

  const result = await addProfessionalResponse(reviewId, userId, input)
  if (!result.success) {
    const status = result.code === 'DUPLICATE' ? HTTP_STATUS.CONFLICT : HTTP_STATUS.NOT_FOUND
    return c.json({ success: false, error: result.error, code: result.code }, status)
  }

  return c.json({ success: true, review: result.review })
})

export default router
