/**
 * Professional Service
 * Profile management, availability, search
 */

import { prisma } from '../../lib/prisma/client'
import type {
  UpdateProfessionalProfileInput,
  SetProfessionalServicesInput,
  SetAvailabilityInput,
  BlockDateInput,
  ProfessionalSearchInput,
} from '@handy-man/shared/validators'

// ── Profile ───────────────────────────────────────────────────────────────────

export async function getProfessionalProfile(professionalId: string) {
  return prisma.professional.findUnique({
    where: { id: professionalId },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          profilePhotoUrl: true,
        },
      },
      services: {
        include: { serviceCategory: true },
      },
      availability: { orderBy: { dayOfWeek: 'asc' } },
    },
  })
}

export async function getProfessionalByUserId(userId: string) {
  return prisma.professional.findUnique({ where: { userId } })
}

export async function updateProfile(
  professionalId: string,
  input: UpdateProfessionalProfileInput
) {
  const existing = await prisma.professional.findUnique({ where: { id: professionalId } })
  if (!existing) return { success: false, error: 'Professional not found', code: 'NOT_FOUND' }

  const professional = await prisma.professional.update({
    where: { id: professionalId },
    data: {
      ...(input.bio !== undefined && { bio: input.bio }),
      ...(input.yearsExperience !== undefined && { yearsExperience: input.yearsExperience }),
      ...(input.serviceRadiusKm !== undefined && { serviceRadiusKm: input.serviceRadiusKm }),
      ...(input.hourlyRate !== undefined && { hourlyRate: String(input.hourlyRate) }),
      ...(input.isAvailable !== undefined && { isAvailable: input.isAvailable }),
      ...(input.isOnVacation !== undefined && { isOnVacation: input.isOnVacation }),
      ...(input.baseLocationLat !== undefined && {
        baseLocationLat: String(input.baseLocationLat),
      }),
      ...(input.baseLocationLng !== undefined && {
        baseLocationLng: String(input.baseLocationLng),
      }),
    },
  })

  return { success: true, professional }
}

// ── Services ──────────────────────────────────────────────────────────────────

export async function setProfessionalServices(
  professionalId: string,
  input: SetProfessionalServicesInput
) {
  const existing = await prisma.professional.findUnique({ where: { id: professionalId } })
  if (!existing) return { success: false, error: 'Professional not found', code: 'NOT_FOUND' }

  // Validate all category IDs exist
  const categoryIds = input.services.map((s) => s.serviceCategoryId)
  const foundCategories = await prisma.serviceCategory.findMany({
    where: { id: { in: categoryIds }, isActive: true },
    select: { id: true },
  })

  if (foundCategories.length !== categoryIds.length) {
    return { success: false, error: 'One or more service categories not found', code: 'NOT_FOUND' }
  }

  // Replace all services (upsert each)
  await prisma.professionalService.deleteMany({ where: { professionalId } })

  await prisma.professionalService.createMany({
    data: input.services.map((s) => ({
      professionalId,
      serviceCategoryId: s.serviceCategoryId,
      customRate: s.customRate ? String(s.customRate) : null,
      yearsExperience: s.yearsExperience,
      isPrimaryService: s.isPrimaryService ?? false,
    })),
  })

  return { success: true }
}

// ── Availability ──────────────────────────────────────────────────────────────

export async function setAvailability(professionalId: string, input: SetAvailabilityInput) {
  const existing = await prisma.professional.findUnique({ where: { id: professionalId } })
  if (!existing) return { success: false, error: 'Professional not found', code: 'NOT_FOUND' }

  // Upsert each day
  await prisma.$transaction(
    input.availability.map((day) =>
      prisma.professionalAvailability.upsert({
        where: { professionalId_dayOfWeek: { professionalId, dayOfWeek: day.dayOfWeek } },
        create: {
          professionalId,
          dayOfWeek: day.dayOfWeek,
          startTime: day.startTime,
          endTime: day.endTime,
          isAvailable: day.isAvailable,
        },
        update: {
          startTime: day.startTime,
          endTime: day.endTime,
          isAvailable: day.isAvailable,
        },
      })
    )
  )

  return { success: true }
}

export async function addBlockedDate(professionalId: string, input: BlockDateInput) {
  const existing = await prisma.professional.findUnique({ where: { id: professionalId } })
  if (!existing) return { success: false, error: 'Professional not found', code: 'NOT_FOUND' }

  const blocked = await prisma.professionalBlockedDate.create({
    data: {
      professionalId,
      blockedDate: new Date(input.blockedDate),
      reason: input.reason,
    },
  })

  return { success: true, blocked }
}

export async function removeBlockedDate(professionalId: string, blockedDateId: string) {
  const record = await prisma.professionalBlockedDate.findFirst({
    where: { id: blockedDateId, professionalId },
  })

  if (!record) return { success: false, error: 'Blocked date not found', code: 'NOT_FOUND' }

  await prisma.professionalBlockedDate.delete({ where: { id: blockedDateId } })
  return { success: true }
}

// ── Search / Listing ──────────────────────────────────────────────────────────

export async function searchProfessionals(input: ProfessionalSearchInput) {
  const { serviceCategoryId, page, limit } = input
  const skip = (page - 1) * limit

  const where = {
    isVerified: true,
    isAvailable: true,
    isOnVacation: false,
    ...(serviceCategoryId && {
      services: { some: { serviceCategoryId } },
    }),
  }

  const [professionals, total] = await Promise.all([
    prisma.professional.findMany({
      where,
      skip,
      take: limit,
      orderBy: [{ averageRating: 'desc' }, { totalJobsCompleted: 'desc' }],
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            profilePhotoUrl: true,
          },
        },
        services: {
          include: { serviceCategory: { select: { name: true, slug: true } } },
        },
      },
    }),
    prisma.professional.count({ where }),
  ])

  return {
    professionals,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  }
}
