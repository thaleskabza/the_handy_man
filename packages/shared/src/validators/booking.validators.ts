/**
 * Booking Validators
 */

import { z } from 'zod'

export const createBookingSchema = z.object({
  serviceCategoryId: z.string().min(1, 'Service category is required'),
  addressId: z.string().min(1, 'Address is required'),
  scheduledDate: z.string().date('Must be a valid date (YYYY-MM-DD)'),
  scheduledTimeStart: z
    .string()
    .regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format'),
  clientDescription: z.string().max(500).optional(),
  professionalId: z.string().optional(), // client may pre-select a pro
  isEmergency: z.boolean().optional().default(false),
})

export const updateBookingStatusSchema = z.object({
  status: z.enum(['CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
  notes: z.string().optional(),
})

export const cancelBookingSchema = z.object({
  reason: z.string().min(1, 'Cancellation reason is required').max(500),
})

export const completeBookingSchema = z.object({
  finalPrice: z.number().positive().optional(),
  priceAdjustmentReason: z.string().max(500).optional(),
  professionalNotes: z.string().max(500).optional(),
})

export const createAddressSchema = z.object({
  label: z.string().min(1).max(50),
  addressLine1: z.string().min(1, 'Street address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  province: z.string().min(1, 'Province is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().optional().default('South Africa'),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  specialInstructions: z.string().max(500).optional(),
  isDefault: z.boolean().optional().default(false),
})

export type CreateBookingInput = z.infer<typeof createBookingSchema>
export type UpdateBookingStatusInput = z.infer<typeof updateBookingStatusSchema>
export type CancelBookingInput = z.infer<typeof cancelBookingSchema>
export type CompleteBookingInput = z.infer<typeof completeBookingSchema>
export type CreateAddressInput = z.infer<typeof createAddressSchema>
