/**
 * Booking Service
 * Core booking lifecycle management
 */

import { prisma } from '../../lib/prisma/client'
import type {
  CreateBookingInput,
  CancelBookingInput,
  CompleteBookingInput,
} from '@handy-man/shared/validators'

// ── Reference number ──────────────────────────────────────────────────────────

function generateBookingRef(): string {
  const year = new Date().getFullYear()
  const rand = Math.floor(100000 + Math.random() * 900000)
  return `HM-${year}-${rand}`
}

// ── Create ────────────────────────────────────────────────────────────────────

export async function createBooking(userId: string, input: CreateBookingInput) {
  // Resolve client
  const client = await prisma.client.findUnique({ where: { userId } })
  if (!client) {
    return { success: false, error: 'Client profile not found', code: 'NOT_FOUND' }
  }

  // Validate address belongs to client
  const address = await prisma.address.findFirst({
    where: { id: input.addressId, clientId: client.id },
  })
  if (!address) {
    return { success: false, error: 'Address not found', code: 'NOT_FOUND' }
  }

  // Validate service category
  const category = await prisma.serviceCategory.findUnique({
    where: { id: input.serviceCategoryId, isActive: true },
  })
  if (!category) {
    return { success: false, error: 'Service category not found', code: 'NOT_FOUND' }
  }

  // Validate pro if pre-selected
  if (input.professionalId) {
    const pro = await prisma.professional.findUnique({
      where: { id: input.professionalId, isVerified: true, isAvailable: true },
    })
    if (!pro) {
      return { success: false, error: 'Professional not available', code: 'NOT_FOUND' }
    }
  }

  // Generate unique ref
  let bookingReference = generateBookingRef()
  while (await prisma.booking.findUnique({ where: { bookingReference } })) {
    bookingReference = generateBookingRef()
  }

  const estimatedPrice = category.basePrice ?? '0'

  const booking = await prisma.booking.create({
    data: {
      bookingReference,
      clientId: client.id,
      professionalId: input.professionalId ?? null,
      serviceCategoryId: input.serviceCategoryId,
      addressId: input.addressId,
      scheduledDate: new Date(input.scheduledDate),
      scheduledTimeStart: input.scheduledTimeStart,
      clientDescription: input.clientDescription,
      estimatedPrice,
      isEmergency: input.isEmergency ?? false,
      statusHistory: {
        create: { newStatus: 'PENDING', notes: 'Booking created' },
      },
    },
    include: {
      serviceCategory: true,
      address: true,
      professional: { include: { user: { select: { firstName: true, lastName: true, profilePhotoUrl: true } } } },
    },
  })

  // Increment client's total bookings
  await prisma.client.update({
    where: { id: client.id },
    data: { totalBookings: { increment: 1 } },
  })

  return { success: true, booking }
}

// ── Read ──────────────────────────────────────────────────────────────────────

export async function getClientBookings(userId: string, filter: 'upcoming' | 'past' | 'all' = 'all') {
  const client = await prisma.client.findUnique({ where: { userId } })
  if (!client) return { success: false, error: 'Client not found', code: 'NOT_FOUND' }

  const now = new Date()

  const where = {
    clientId: client.id,
    ...(filter === 'upcoming' && {
      status: { in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'] as const },
    }),
    ...(filter === 'past' && {
      status: { in: ['COMPLETED', 'CANCELLED'] as const },
    }),
  }

  const bookings = await prisma.booking.findMany({
    where,
    orderBy: { scheduledDate: filter === 'past' ? 'desc' : 'asc' },
    include: {
      serviceCategory: { select: { name: true, slug: true } },
      address: { select: { label: true, city: true, addressLine1: true } },
      professional: {
        include: {
          user: { select: { firstName: true, lastName: true, profilePhotoUrl: true } },
        },
      },
    },
  })

  return { success: true, bookings }
}

export async function getBookingById(bookingId: string, userId: string) {
  const client = await prisma.client.findUnique({ where: { userId } })

  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      ...(client ? { clientId: client.id } : {}),
    },
    include: {
      serviceCategory: true,
      address: true,
      professional: {
        include: {
          user: { select: { firstName: true, lastName: true, profilePhotoUrl: true, phone: true } },
        },
      },
      statusHistory: { orderBy: { createdAt: 'asc' } },
      review: true,
      payment: true,
    },
  })

  if (!booking) return { success: false, error: 'Booking not found', code: 'NOT_FOUND' }
  return { success: true, booking }
}

// ── Cancel ────────────────────────────────────────────────────────────────────

export async function cancelBooking(bookingId: string, userId: string, input: CancelBookingInput) {
  const client = await prisma.client.findUnique({ where: { userId } })
  if (!client) return { success: false, error: 'Client not found', code: 'NOT_FOUND' }

  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, clientId: client.id },
  })

  if (!booking) return { success: false, error: 'Booking not found', code: 'NOT_FOUND' }

  if (!['PENDING', 'CONFIRMED'].includes(booking.status)) {
    return { success: false, error: 'Booking cannot be cancelled at this stage', code: 'INVALID_STATUS' }
  }

  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: 'CANCELLED',
      cancellationReason: input.reason,
      cancelledBy: 'CLIENT',
      cancelledAt: new Date(),
      statusHistory: {
        create: {
          oldStatus: booking.status,
          newStatus: 'CANCELLED',
          changedByUserId: userId,
          notes: input.reason,
        },
      },
    },
  })

  return { success: true, booking: updated }
}

// ── Professional: accept/decline ──────────────────────────────────────────────

export async function acceptBooking(bookingId: string, userId: string) {
  const professional = await prisma.professional.findUnique({ where: { userId } })
  if (!professional) return { success: false, error: 'Professional not found', code: 'NOT_FOUND' }

  const booking = await prisma.booking.findUnique({ where: { id: bookingId } })
  if (!booking || booking.status !== 'PENDING') {
    return { success: false, error: 'Booking not available', code: 'INVALID_STATUS' }
  }

  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data: {
      professionalId: professional.id,
      status: 'CONFIRMED',
      statusHistory: {
        create: {
          oldStatus: 'PENDING',
          newStatus: 'CONFIRMED',
          changedByUserId: userId,
        },
      },
    },
  })

  return { success: true, booking: updated }
}

export async function startBooking(bookingId: string, userId: string) {
  const professional = await prisma.professional.findUnique({ where: { userId } })
  if (!professional) return { success: false, error: 'Professional not found', code: 'NOT_FOUND' }

  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, professionalId: professional.id, status: 'CONFIRMED' },
  })
  if (!booking) return { success: false, error: 'Booking not found', code: 'NOT_FOUND' }

  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: 'IN_PROGRESS',
      actualStartTime: new Date(),
      statusHistory: {
        create: { oldStatus: 'CONFIRMED', newStatus: 'IN_PROGRESS', changedByUserId: userId },
      },
    },
  })

  return { success: true, booking: updated }
}

export async function completeBooking(
  bookingId: string,
  userId: string,
  input: CompleteBookingInput
) {
  const professional = await prisma.professional.findUnique({ where: { userId } })
  if (!professional) return { success: false, error: 'Professional not found', code: 'NOT_FOUND' }

  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, professionalId: professional.id, status: 'IN_PROGRESS' },
  })
  if (!booking) return { success: false, error: 'Booking not found', code: 'NOT_FOUND' }

  const finalPrice = input.finalPrice
    ? String(input.finalPrice)
    : booking.estimatedPrice
  const platformFeeAmount = (Number(finalPrice) * Number(booking.platformFeePercentage)) / 100
  const professionalEarnings = Number(finalPrice) - platformFeeAmount

  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: 'COMPLETED',
      actualEndTime: new Date(),
      completedAt: new Date(),
      finalPrice,
      priceAdjustmentReason: input.priceAdjustmentReason,
      professionalNotes: input.professionalNotes,
      platformFeeAmount: String(platformFeeAmount),
      professionalEarnings: String(professionalEarnings),
      statusHistory: {
        create: { oldStatus: 'IN_PROGRESS', newStatus: 'COMPLETED', changedByUserId: userId },
      },
    },
  })

  // Update professional stats
  await prisma.professional.update({
    where: { id: professional.id },
    data: {
      totalJobsCompleted: { increment: 1 },
      totalEarnings: { increment: professionalEarnings },
      availableBalance: { increment: professionalEarnings },
    },
  })

  return { success: true, booking: updated }
}

// ── Address management ────────────────────────────────────────────────────────

export async function getClientAddresses(userId: string) {
  const client = await prisma.client.findUnique({ where: { userId } })
  if (!client) return { success: false, error: 'Client not found', code: 'NOT_FOUND' }

  const addresses = await prisma.address.findMany({
    where: { clientId: client.id },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }],
  })

  return { success: true, addresses }
}

export async function createClientAddress(userId: string, input: import('@handy-man/shared/validators').CreateAddressInput) {
  const client = await prisma.client.findUnique({ where: { userId } })
  if (!client) return { success: false, error: 'Client not found', code: 'NOT_FOUND' }

  // If setting as default, unset all others
  if (input.isDefault) {
    await prisma.address.updateMany({
      where: { clientId: client.id },
      data: { isDefault: false },
    })
  }

  const address = await prisma.address.create({
    data: {
      clientId: client.id,
      label: input.label,
      addressLine1: input.addressLine1,
      addressLine2: input.addressLine2,
      city: input.city,
      province: input.province,
      postalCode: input.postalCode,
      country: input.country ?? 'South Africa',
      latitude: input.latitude ? String(input.latitude) : undefined,
      longitude: input.longitude ? String(input.longitude) : undefined,
      specialInstructions: input.specialInstructions,
      isDefault: input.isDefault ?? false,
    },
  })

  return { success: true, address }
}
