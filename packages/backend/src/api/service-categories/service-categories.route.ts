/**
 * Service Categories Routes
 *
 * Public:
 *   GET  /service-categories          — list active categories
 *   GET  /service-categories/:slug    — get single category
 *
 * Admin only:
 *   POST   /service-categories              — create
 *   PATCH  /service-categories/:slug        — update
 *   PATCH  /service-categories/:slug/toggle — activate/deactivate
 */

import { Hono } from 'hono'
import {
  createServiceCategorySchema,
  updateServiceCategorySchema,
} from '@handy-man/shared/validators'
import { HTTP_STATUS } from '@handy-man/shared/constants'
import { validateRequest } from '../../middleware/validation.middleware'
import { authenticate, requireRole } from '../../middleware/auth.middleware'
import {
  getAllCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  toggleCategoryActive,
} from '../../services/service-categories/service-category.service'
import type {
  CreateServiceCategoryInput,
  UpdateServiceCategoryInput,
} from '@handy-man/shared/validators'

const router = new Hono()

// ── Public routes ────────────────────────────────────────────────────────────

router.get('/', async (c) => {
  const categories = await getAllCategories(true)
  return c.json({ success: true, categories })
})

router.get('/:slug', async (c) => {
  const { slug } = c.req.param()
  const category = await getCategoryBySlug(slug)

  if (!category || !category.is_active) {
    return c.json(
      { success: false, error: 'Category not found', code: 'NOT_FOUND' },
      HTTP_STATUS.NOT_FOUND
    )
  }

  return c.json({ success: true, category })
})

// ── Admin routes ─────────────────────────────────────────────────────────────

router.post(
  '/',
  authenticate,
  requireRole('ADMIN'),
  validateRequest(createServiceCategorySchema),
  async (c) => {
    const input = c.get('validated') as CreateServiceCategoryInput
    const result = await createCategory(input)

    if (!result.success) {
      return c.json(
        { success: false, error: result.error, code: result.code },
        HTTP_STATUS.CONFLICT
      )
    }

    return c.json({ success: true, category: result.category }, HTTP_STATUS.CREATED)
  }
)

router.patch(
  '/:slug',
  authenticate,
  requireRole('ADMIN'),
  validateRequest(updateServiceCategorySchema),
  async (c) => {
    const { slug } = c.req.param()
    const input = c.get('validated') as UpdateServiceCategoryInput
    const result = await updateCategory(slug, input)

    if (!result.success) {
      const status =
        result.code === 'NOT_FOUND' ? HTTP_STATUS.NOT_FOUND : HTTP_STATUS.BAD_REQUEST
      return c.json({ success: false, error: result.error, code: result.code }, status)
    }

    return c.json({ success: true, category: result.category })
  }
)

router.patch('/:slug/toggle', authenticate, requireRole('ADMIN'), async (c) => {
  const { slug } = c.req.param()
  const result = await toggleCategoryActive(slug)

  if (!result.success) {
    return c.json(
      { success: false, error: result.error, code: result.code },
      HTTP_STATUS.NOT_FOUND
    )
  }

  return c.json({ success: true, category: result.category })
})

export default router
