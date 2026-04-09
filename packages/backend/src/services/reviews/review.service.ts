/**
 * Review Service
 */

import { supabase } from '../../lib/supabase/client'
import type { CreateReviewInput, ProfessionalResponseInput } from '@handy-man/shared/validators'

export async function createReview(userId: string, input: CreateReviewInput) {
  const { data: client } = await supabase
    .from('clients')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle()

  if (!client) return { success: false, error: 'Client profile not found', code: 'NOT_FOUND' }

  const { data: booking } = await supabase
    .from('bookings')
    .select('id, professional_id, status')
    .eq('id', input.bookingId)
    .eq('client_id', client.id)
    .eq('status', 'COMPLETED')
    .maybeSingle()

  if (!booking) {
    return { success: false, error: 'Booking not found or not eligible for review', code: 'NOT_FOUND' }
  }
  if (!booking.professional_id) {
    return { success: false, error: 'No professional assigned to this booking', code: 'INVALID' }
  }

  const { data: existing } = await supabase
    .from('reviews')
    .select('id')
    .eq('booking_id', input.bookingId)
    .maybeSingle()

  if (existing) {
    return { success: false, error: 'Review already submitted for this booking', code: 'DUPLICATE' }
  }

  const { data: review, error } = await supabase
    .from('reviews')
    .insert({
      booking_id: input.bookingId,
      client_id: client.id,
      professional_id: booking.professional_id,
      overall_rating: input.overallRating,
      punctuality_rating: input.punctualityRating ?? null,
      quality_rating: input.qualityRating ?? null,
      professionalism_rating: input.professionalismRating ?? null,
      value_rating: input.valueRating ?? null,
      review_text: input.reviewText ?? null,
      would_recommend: input.wouldRecommend ?? true,
    })
    .select()
    .single()

  if (error) return { success: false, error: error.message, code: 'SERVER_ERROR' }

  // Recalculate average rating
  const { data: stats } = await supabase
    .from('reviews')
    .select('overall_rating')
    .eq('professional_id', booking.professional_id)
    .eq('is_visible', true)

  if (stats) {
    const avg = stats.reduce((sum, r) => sum + r.overall_rating, 0) / stats.length
    await supabase
      .from('professionals')
      .update({ average_rating: avg, total_reviews: stats.length })
      .eq('id', booking.professional_id)
  }

  return { success: true, review }
}

export async function getProfessionalReviews(professionalId: string, page = 1, limit = 10) {
  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data: reviews, error, count } = await supabase
    .from('reviews')
    .select(`
      *,
      clients(
        users(first_name, last_name, profile_photo_url)
      )
    `, { count: 'exact' })
    .eq('professional_id', professionalId)
    .eq('is_visible', true)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) return { success: false, error: error.message, code: 'SERVER_ERROR' }

  return { success: true, reviews, total: count ?? 0, page, limit }
}

export async function addProfessionalResponse(
  reviewId: string,
  userId: string,
  input: ProfessionalResponseInput
) {
  const { data: professional } = await supabase
    .from('professionals')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle()

  if (!professional) return { success: false, error: 'Professional not found', code: 'NOT_FOUND' }

  const { data: review } = await supabase
    .from('reviews')
    .select('id, professional_response')
    .eq('id', reviewId)
    .eq('professional_id', professional.id)
    .maybeSingle()

  if (!review) return { success: false, error: 'Review not found', code: 'NOT_FOUND' }
  if (review.professional_response) {
    return { success: false, error: 'Response already submitted', code: 'DUPLICATE' }
  }

  const { data: updated, error } = await supabase
    .from('reviews')
    .update({ professional_response: input.response, responded_at: new Date().toISOString() })
    .eq('id', reviewId)
    .select()
    .single()

  if (error) return { success: false, error: error.message, code: 'SERVER_ERROR' }
  return { success: true, review: updated }
}
