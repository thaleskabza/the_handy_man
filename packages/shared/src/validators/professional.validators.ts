/**
 * Professional Profile Validators
 */

import { z } from 'zod'
import { phoneSchema } from './auth.validators'

export const updateProfessionalProfileSchema = z.object({
  bio: z.string().max(300).optional(),
  yearsExperience: z.number().int().min(0).max(60).optional(),
  serviceRadiusKm: z.number().int().min(1).max(100).optional(),
  hourlyRate: z.number().positive().optional(),
  isAvailable: z.boolean().optional(),
  isOnVacation: z.boolean().optional(),
  baseLocationLat: z.number().min(-90).max(90).optional(),
  baseLocationLng: z.number().min(-180).max(180).optional(),
})

export const setProfessionalServicesSchema = z.object({
  services: z
    .array(
      z.object({
        serviceCategoryId: z.string().min(1),
        customRate: z.number().positive().optional(),
        yearsExperience: z.number().int().min(0).optional(),
        isPrimaryService: z.boolean().optional().default(false),
      })
    )
    .min(1, 'At least one service is required'),
})

export const setAvailabilitySchema = z.object({
  availability: z.array(
    z.object({
      dayOfWeek: z.number().int().min(0).max(6),
      startTime: z
        .string()
        .regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format'),
      endTime: z
        .string()
        .regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format'),
      isAvailable: z.boolean().default(true),
    })
  ),
})

export const blockDateSchema = z.object({
  blockedDate: z.string().date('Must be a valid date (YYYY-MM-DD)'),
  reason: z.string().max(255).optional(),
})

export const professionalSearchSchema = z.object({
  serviceCategoryId: z.string().optional(),
  lat: z.coerce.number().min(-90).max(90).optional(),
  lng: z.coerce.number().min(-180).max(180).optional(),
  radiusKm: z.coerce.number().int().min(1).max(100).optional().default(20),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(20),
})

export type UpdateProfessionalProfileInput = z.infer<typeof updateProfessionalProfileSchema>
export type SetProfessionalServicesInput = z.infer<typeof setProfessionalServicesSchema>
export type SetAvailabilityInput = z.infer<typeof setAvailabilitySchema>
export type BlockDateInput = z.infer<typeof blockDateSchema>
export type ProfessionalSearchInput = z.infer<typeof professionalSearchSchema>
