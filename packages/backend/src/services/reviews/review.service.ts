/**
 * Review Service
 */

import { prisma } from '../../lib/prisma/client'
import type { CreateReviewInput, ProfessionalResponseInput } from '@handy-man/shared/validators'

export async function createReview(userId: string, input: CreateReviewInput) {
  const client = await prisma.client.findUnique({ where: { userId } })
  if (!client) return { success: false, error: 'Client profile not found', code: 'NOT_FOUND' }

  // Verify the booking exists, belongs to client, and is completed
  const booking = await prisma.booking.findFirst({
    where: { id: input.bookingId, clientId: client.id, status: 'COMPLETED' },
  })
  if (!booking) {
    return { success: false, error: 'Booking not found or not eligible for review', code: 'NOT_FOUND' }
  }
  if (!booking.professionalId) {
    return { success: false, error: 'No professional assigned to this booking', code: 'INVALID' }
  }

  // Prevent duplicate reviews
  const existing = await prisma.review.findUnique({ where: { bookingId: input.bookingId } })
  if (existing) {
    return { success: false, error: 'Review already submitted for this booking', code: 'DUPLICATE' }
  }

  const review = await prisma.review.create({
    data: {
      bookingId: input.bookingId,
      clientId: client.id,
      professionalId: booking.professionalId,
      overallRating: input.overallRating,
      punctualityRating: input.punctualityRating,
      qualityRating: input.qualityRating,
      professionalismRating: input.professionalismRating,
      valueRating: input.valueRating,
      reviewText: input.reviewText,
      wouldRecommend: input.wouldRecommend ?? true,
    },
  })

  // Recalculate professional's average rating
  const stats = await prisma.review.aggregate({
    where: { professionalId: booking.professionalId, isVisible: true },
    _avg: { overallRating: true },
    _count: { id: true },
  })

  await prisma.professional.update({
    where: { id: booking.professionalId },
    data: {
      averageRating: stats._avg.overallRating ? String(stats._avg.overallRating) : null,
      totalReviews: stats._count.id,
    },
  })

  return { success: true, review }
}

export async function getProfessionalReviews(
  professionalId: string,
  page = 1,
  limit = 10
) {
  const skip = (page - 1) * limit

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where: { professionalId, isVisible: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        client: { include: { user: { select: { firstName: true, lastName: true, profilePhotoUrl: true } } } },
      },
    }),
    prisma.review.count({ where: { professionalId, isVisible: true } }),
  ])

  return { success: true, reviews, total, page, limit }
}

export async function addProfessionalResponse(
  reviewId: string,
  userId: string,
  input: ProfessionalResponseInput
) {
  const professional = await prisma.professional.findUnique({ where: { userId } })
  if (!professional) return { success: false, error: 'Professional not found', code: 'NOT_FOUND' }

  const review = await prisma.review.findFirst({
    where: { id: reviewId, professionalId: professional.id },
  })
  if (!review) return { success: false, error: 'Review not found', code: 'NOT_FOUND' }
  if (review.professionalResponse) {
    return { success: false, error: 'Response already submitted', code: 'DUPLICATE' }
  }

  const updated = await prisma.review.update({
    where: { id: reviewId },
    data: { professionalResponse: input.response, respondedAt: new Date() },
  })

  return { success: true, review: updated }
}
