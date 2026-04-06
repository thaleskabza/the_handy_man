/**
 * Service Category Service
 */

import { prisma } from '../../lib/prisma/client'
import type {
  CreateServiceCategoryInput,
  UpdateServiceCategoryInput,
} from '@handy-man/shared/validators'

export async function getAllCategories(activeOnly = true) {
  return prisma.serviceCategory.findMany({
    where: activeOnly ? { isActive: true } : undefined,
    orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      iconUrl: true,
      isActive: true,
      displayOrder: true,
      estimatedDurationHours: true,
      basePrice: true,
    },
  })
}

export async function getCategoryBySlug(slug: string) {
  return prisma.serviceCategory.findUnique({
    where: { slug },
  })
}

export async function createCategory(input: CreateServiceCategoryInput) {
  const existing = await prisma.serviceCategory.findFirst({
    where: { OR: [{ name: input.name }, { slug: input.slug }] },
  })

  if (existing) {
    const field = existing.name === input.name ? 'name' : 'slug'
    return { success: false, error: `A category with that ${field} already exists`, code: 'CONFLICT' }
  }

  const category = await prisma.serviceCategory.create({
    data: {
      name: input.name,
      slug: input.slug,
      description: input.description,
      iconUrl: input.iconUrl,
      displayOrder: input.displayOrder ?? 0,
      estimatedDurationHours: input.estimatedDurationHours
        ? String(input.estimatedDurationHours)
        : undefined,
      basePrice: input.basePrice ? String(input.basePrice) : undefined,
    },
  })

  return { success: true, category }
}

export async function updateCategory(slug: string, input: UpdateServiceCategoryInput) {
  const existing = await prisma.serviceCategory.findUnique({ where: { slug } })

  if (!existing) {
    return { success: false, error: 'Category not found', code: 'NOT_FOUND' }
  }

  const category = await prisma.serviceCategory.update({
    where: { slug },
    data: {
      ...(input.name !== undefined && { name: input.name }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.iconUrl !== undefined && { iconUrl: input.iconUrl }),
      ...(input.displayOrder !== undefined && { displayOrder: input.displayOrder }),
      ...(input.estimatedDurationHours !== undefined && {
        estimatedDurationHours: String(input.estimatedDurationHours),
      }),
      ...(input.basePrice !== undefined && { basePrice: String(input.basePrice) }),
    },
  })

  return { success: true, category }
}

export async function toggleCategoryActive(slug: string) {
  const existing = await prisma.serviceCategory.findUnique({ where: { slug } })

  if (!existing) {
    return { success: false, error: 'Category not found', code: 'NOT_FOUND' }
  }

  const category = await prisma.serviceCategory.update({
    where: { slug },
    data: { isActive: !existing.isActive },
  })

  return { success: true, category }
}
