/**
 * Bookings Routes
 *
 * Client:
 *   GET  /bookings                     — list my bookings
 *   POST /bookings                     — create booking
 *   GET  /bookings/:id                 — get booking detail
 *   POST /bookings/:id/cancel          — cancel booking
 *
 * Professional:
 *   POST /bookings/:id/accept          — accept job
 *   POST /bookings/:id/start           — start job
 *   POST /bookings/:id/complete        — complete job
 *
 * Addresses (client):
 *   GET  /bookings/addresses           — list saved addresses
 *   POST /bookings/addresses           — add address
 */

import { Hono } from 'hono'
import {
  createBookingSchema,
  cancelBookingSchema,
  completeBookingSchema,
  createAddressSchema,
} from '@handy-man/shared/validators'
import { HTTP_STATUS } from '@handy-man/shared/constants'
import { validateRequest } from '../../middleware/validation.middleware'
import { authenticate, requireRole } from '../../middleware/auth.middleware'
import {
  createBooking,
  getClientBookings,
  getBookingById,
  cancelBooking,
  acceptBooking,
  startBooking,
  completeBooking,
  getClientAddresses,
  createClientAddress,
} from '../../services/bookings/booking.service'
import type {
  CreateBookingInput,
  CancelBookingInput,
  CompleteBookingInput,
  CreateAddressInput,
} from '@handy-man/shared/validators'

const router = new Hono()

// ── Addresses ─────────────────────────────────────────────────────────────────

router.get('/addresses', authenticate, requireRole('CLIENT'), async (c) => {
  const userId = c.get('userId')
  const result = await getClientAddresses(userId)
  if (!result.success) {
    return c.json({ success: false, error: result.error }, HTTP_STATUS.NOT_FOUND)
  }
  return c.json({ success: true, addresses: result.addresses })
})

router.post(
  '/addresses',
  authenticate,
  requireRole('CLIENT'),
  validateRequest(createAddressSchema),
  async (c) => {
    const userId = c.get('userId')
    const input = c.get('validated') as CreateAddressInput
    const result = await createClientAddress(userId, input)
    if (!result.success) {
      return c.json({ success: false, error: result.error }, HTTP_STATUS.BAD_REQUEST)
    }
    return c.json({ success: true, address: result.address }, HTTP_STATUS.CREATED)
  }
)

// ── Client booking actions ────────────────────────────────────────────────────

router.get('/', authenticate, requireRole('CLIENT'), async (c) => {
  const userId = c.get('userId')
  const filter = (c.req.query('filter') as 'upcoming' | 'past' | 'all') || 'all'
  const result = await getClientBookings(userId, filter)
  if (!result.success) {
    return c.json({ success: false, error: result.error }, HTTP_STATUS.NOT_FOUND)
  }
  return c.json({ success: true, bookings: result.bookings })
})

router.post(
  '/',
  authenticate,
  requireRole('CLIENT'),
  validateRequest(createBookingSchema),
  async (c) => {
    const userId = c.get('userId')
    const input = c.get('validated') as CreateBookingInput
    const result = await createBooking(userId, input)
    if (!result.success) {
      const status =
        result.code === 'NOT_FOUND' ? HTTP_STATUS.NOT_FOUND : HTTP_STATUS.BAD_REQUEST
      return c.json({ success: false, error: result.error, code: result.code }, status)
    }
    return c.json({ success: true, booking: result.booking }, HTTP_STATUS.CREATED)
  }
)

router.get('/:id', authenticate, async (c) => {
  const userId = c.get('userId')
  const { id } = c.req.param()
  const result = await getBookingById(id, userId)
  if (!result.success) {
    return c.json({ success: false, error: result.error }, HTTP_STATUS.NOT_FOUND)
  }
  return c.json({ success: true, booking: result.booking })
})

router.post(
  '/:id/cancel',
  authenticate,
  requireRole('CLIENT'),
  validateRequest(cancelBookingSchema),
  async (c) => {
    const userId = c.get('userId')
    const { id } = c.req.param()
    const input = c.get('validated') as CancelBookingInput
    const result = await cancelBooking(id, userId, input)
    if (!result.success) {
      const status =
        result.code === 'INVALID_STATUS' ? HTTP_STATUS.UNPROCESSABLE_ENTITY : HTTP_STATUS.NOT_FOUND
      return c.json({ success: false, error: result.error, code: result.code }, status)
    }
    return c.json({ success: true, booking: result.booking })
  }
)

// ── Professional job actions ──────────────────────────────────────────────────

router.post('/:id/accept', authenticate, requireRole('HANDYMAN'), async (c) => {
  const userId = c.get('userId')
  const { id } = c.req.param()
  const result = await acceptBooking(id, userId)
  if (!result.success) {
    return c.json({ success: false, error: result.error }, HTTP_STATUS.BAD_REQUEST)
  }
  return c.json({ success: true, booking: result.booking })
})

router.post('/:id/start', authenticate, requireRole('HANDYMAN'), async (c) => {
  const userId = c.get('userId')
  const { id } = c.req.param()
  const result = await startBooking(id, userId)
  if (!result.success) {
    return c.json({ success: false, error: result.error }, HTTP_STATUS.BAD_REQUEST)
  }
  return c.json({ success: true, booking: result.booking })
})

router.post(
  '/:id/complete',
  authenticate,
  requireRole('HANDYMAN'),
  validateRequest(completeBookingSchema),
  async (c) => {
    const userId = c.get('userId')
    const { id } = c.req.param()
    const input = c.get('validated') as CompleteBookingInput
    const result = await completeBooking(id, userId, input)
    if (!result.success) {
      return c.json({ success: false, error: result.error }, HTTP_STATUS.BAD_REQUEST)
    }
    return c.json({ success: true, booking: result.booking })
  }
)

export default router
