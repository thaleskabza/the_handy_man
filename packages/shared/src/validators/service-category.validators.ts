/**
 * Service Category Validators
 */

import { z } from 'zod'

const slugSchema = z
  .string()
  .min(1)
  .max(100)
  .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only')

export const createServiceCategorySchema = z.object({
  name: z.string().min(2).max(100),
  slug: slugSchema,
  description: z.string().max(500).optional(),
  iconUrl: z.string().url('Invalid icon URL').optional(),
  displayOrder: z.number().int().min(0).optional().default(0),
  estimatedDurationHours: z.number().positive().optional(),
  basePrice: z.number().positive().optional(),
})

export const updateServiceCategorySchema = createServiceCategorySchema
  .partial()
  .omit({ slug: true })

export const serviceCategoryParamsSchema = z.object({
  slug: slugSchema,
})

export type CreateServiceCategoryInput = z.infer<typeof createServiceCategorySchema>
export type UpdateServiceCategoryInput = z.infer<typeof updateServiceCategorySchema>
