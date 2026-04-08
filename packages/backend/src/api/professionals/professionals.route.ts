/**
 * Professionals Routes
 *
 * Public:
 *   GET  /professionals                — search/list verified professionals
 *   GET  /professionals/:id            — get public profile
 *
 * Handyman (authenticated + own profile):
 *   GET    /professionals/me           — get own full profile
 *   PATCH  /professionals/me           — update own profile
 *   PUT    /professionals/me/services  — set offered services
 *   PUT    /professionals/me/availability — set weekly availability
 *   POST   /professionals/me/blocked-dates — block a date
 *   DELETE /professionals/me/blocked-dates/:dateId — unblock a date
 */

import { Hono } from 'hono'
import {
  updateProfessionalProfileSchema,
  setProfessionalServicesSchema,
  setAvailabilitySchema,
  blockDateSchema,
  professionalSearchSchema,
} from '@handy-man/shared/validators'
import { HTTP_STATUS } from '@handy-man/shared/constants'
import { validateRequest } from '../../middleware/validation.middleware'
import { authenticate, requireRole } from '../../middleware/auth.middleware'
import {
  getProfessionalProfile,
  getProfessionalByUserId,
  updateProfile,
  setProfessionalServices,
  setAvailability,
  addBlockedDate,
  removeBlockedDate,
  searchProfessionals,
  submitApplication,
  getMyApplication,
} from '../../services/professionals/professional.service'
import {
  submitApplicationSchema,
} from '@handy-man/shared/validators'
import type {
  UpdateProfessionalProfileInput,
  SetProfessionalServicesInput,
  SetAvailabilityInput,
  BlockDateInput,
  SubmitApplicationInput,
} from '@handy-man/shared/validators'

const router = new Hono()

// ── Public ────────────────────────────────────────────────────────────────────

router.get('/', async (c) => {
  const query = c.req.query()
  const parsed = professionalSearchSchema.safeParse(query)

  if (!parsed.success) {
    return c.json(
      { success: false, error: 'Invalid query parameters', code: 'VALIDATION_ERROR' },
      HTTP_STATUS.BAD_REQUEST
    )
  }

  const result = await searchProfessionals(parsed.data)
  return c.json({ success: true, ...result })
})

router.get('/:id', async (c) => {
  const { id } = c.req.param()
  const professional = await getProfessionalProfile(id)

  if (!professional) {
    return c.json(
      { success: false, error: 'Professional not found', code: 'NOT_FOUND' },
      HTTP_STATUS.NOT_FOUND
    )
  }

  return c.json({ success: true, professional })
})

// ── Authenticated handyman routes ─────────────────────────────────────────────

router.get('/me', authenticate, requireRole('HANDYMAN'), async (c) => {
  const userId = c.get('userId')
  const professional = await getProfessionalByUserId(userId)

  if (!professional) {
    return c.json(
      { success: false, error: 'Professional profile not found', code: 'NOT_FOUND' },
      HTTP_STATUS.NOT_FOUND
    )
  }

  const full = await getProfessionalProfile(professional.id)
  return c.json({ success: true, professional: full })
})

router.patch(
  '/me',
  authenticate,
  requireRole('HANDYMAN'),
  validateRequest(updateProfessionalProfileSchema),
  async (c) => {
    const userId = c.get('userId')
    const input = c.get('validated') as UpdateProfessionalProfileInput
    const professional = await getProfessionalByUserId(userId)

    if (!professional) {
      return c.json(
        { success: false, error: 'Professional profile not found', code: 'NOT_FOUND' },
        HTTP_STATUS.NOT_FOUND
      )
    }

    const result = await updateProfile(professional.id, input)

    if (!result.success) {
      return c.json(
        { success: false, error: result.error, code: result.code },
        HTTP_STATUS.BAD_REQUEST
      )
    }

    return c.json({ success: true, professional: result.professional })
  }
)

router.put(
  '/me/services',
  authenticate,
  requireRole('HANDYMAN'),
  validateRequest(setProfessionalServicesSchema),
  async (c) => {
    const userId = c.get('userId')
    const input = c.get('validated') as SetProfessionalServicesInput
    const professional = await getProfessionalByUserId(userId)

    if (!professional) {
      return c.json(
        { success: false, error: 'Professional profile not found', code: 'NOT_FOUND' },
        HTTP_STATUS.NOT_FOUND
      )
    }

    const result = await setProfessionalServices(professional.id, input)

    if (!result.success) {
      const status =
        result.code === 'NOT_FOUND' ? HTTP_STATUS.NOT_FOUND : HTTP_STATUS.BAD_REQUEST
      return c.json({ success: false, error: result.error, code: result.code }, status)
    }

    return c.json({ success: true, message: 'Services updated' })
  }
)

router.put(
  '/me/availability',
  authenticate,
  requireRole('HANDYMAN'),
  validateRequest(setAvailabilitySchema),
  async (c) => {
    const userId = c.get('userId')
    const input = c.get('validated') as SetAvailabilityInput
    const professional = await getProfessionalByUserId(userId)

    if (!professional) {
      return c.json(
        { success: false, error: 'Professional profile not found', code: 'NOT_FOUND' },
        HTTP_STATUS.NOT_FOUND
      )
    }

    const result = await setAvailability(professional.id, input)

    if (!result.success) {
      return c.json(
        { success: false, error: result.error, code: result.code },
        HTTP_STATUS.BAD_REQUEST
      )
    }

    return c.json({ success: true, message: 'Availability updated' })
  }
)

router.post(
  '/me/blocked-dates',
  authenticate,
  requireRole('HANDYMAN'),
  validateRequest(blockDateSchema),
  async (c) => {
    const userId = c.get('userId')
    const input = c.get('validated') as BlockDateInput
    const professional = await getProfessionalByUserId(userId)

    if (!professional) {
      return c.json(
        { success: false, error: 'Professional profile not found', code: 'NOT_FOUND' },
        HTTP_STATUS.NOT_FOUND
      )
    }

    const result = await addBlockedDate(professional.id, input)

    if (!result.success) {
      return c.json(
        { success: false, error: result.error, code: result.code },
        HTTP_STATUS.BAD_REQUEST
      )
    }

    return c.json({ success: true, blocked: result.blocked }, HTTP_STATUS.CREATED)
  }
)

// POST /professionals/me/apply — submit verification application
router.post(
  '/me/apply',
  authenticate,
  requireRole('HANDYMAN'),
  validateRequest(submitApplicationSchema),
  async (c) => {
    const userId = c.get('userId')
    const input = c.get('validated') as SubmitApplicationInput
    const result = await submitApplication(userId, input)

    if (!result.success) {
      const status = result.code === 'DUPLICATE' ? HTTP_STATUS.CONFLICT : HTTP_STATUS.NOT_FOUND
      return c.json({ success: false, error: result.error, code: result.code }, status)
    }

    return c.json({ success: true, application: result.application }, HTTP_STATUS.CREATED)
  }
)

// GET /professionals/me/apply — get own application status
router.get('/me/apply', authenticate, requireRole('HANDYMAN'), async (c) => {
  const userId = c.get('userId')
  const result = await getMyApplication(userId)
  if (!result.success) {
    return c.json({ success: false, error: result.error, code: result.code }, HTTP_STATUS.NOT_FOUND)
  }
  return c.json({ success: true, application: result.application })
})

router.delete('/me/blocked-dates/:dateId', authenticate, requireRole('HANDYMAN'), async (c) => {
  const userId = c.get('userId')
  const { dateId } = c.req.param()
  const professional = await getProfessionalByUserId(userId)

  if (!professional) {
    return c.json(
      { success: false, error: 'Professional profile not found', code: 'NOT_FOUND' },
      HTTP_STATUS.NOT_FOUND
    )
  }

  const result = await removeBlockedDate(professional.id, dateId)

  if (!result.success) {
    return c.json(
      { success: false, error: result.error, code: result.code },
      HTTP_STATUS.NOT_FOUND
    )
  }

  return c.json({ success: true, message: 'Blocked date removed' })
})

export default router
