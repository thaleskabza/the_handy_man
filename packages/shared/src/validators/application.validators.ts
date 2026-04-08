/**
 * Professional Application Validators
 */

import { z } from 'zod'

export const submitApplicationSchema = z.object({
  yearsExperience: z.number().int().min(0),
  selectedCategories: z.array(z.string().min(1)).min(1, 'Select at least one service category'),
  idDocumentUrl: z.string().url().optional(),
  certificationsUrls: z.array(z.string().url()).optional(),
  referencesUrls: z.array(z.string().url()).optional(),
  agreedToBackgroundCheck: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to a background check' }),
  }),
})

export const reviewApplicationSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED']),
  adminNotes: z.string().max(1000).optional(),
  rejectionReason: z.string().max(500).optional(),
})

export type SubmitApplicationInput = z.infer<typeof submitApplicationSchema>
export type ReviewApplicationInput = z.infer<typeof reviewApplicationSchema>
