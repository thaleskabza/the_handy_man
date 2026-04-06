/**
 * Review Validators
 */

import { z } from 'zod'

const rating = (label: string) =>
  z.number().int().min(1, `${label} must be at least 1`).max(5, `${label} must be at most 5`)

export const createReviewSchema = z.object({
  bookingId: z.string().min(1, 'Booking ID is required'),
  overallRating: rating('Overall rating'),
  punctualityRating: rating('Punctuality rating').optional(),
  qualityRating: rating('Quality rating').optional(),
  professionalismRating: rating('Professionalism rating').optional(),
  valueRating: rating('Value rating').optional(),
  reviewText: z.string().max(500).optional(),
  wouldRecommend: z.boolean().optional().default(true),
})

export const professionalResponseSchema = z.object({
  response: z.string().min(1).max(500),
})

export type CreateReviewInput = z.infer<typeof createReviewSchema>
export type ProfessionalResponseInput = z.infer<typeof professionalResponseSchema>
