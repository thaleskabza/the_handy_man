/**
 * Booking Service
 */

import { supabase } from '../../lib/supabase/client'
import type {
  CreateBookingInput,
  CancelBookingInput,
  CompleteBookingInput,
} from '@handy-man/shared/validators'
import type { CreateAddressInput } from '@handy-man/shared/validators'

function generateBookingRef(): string {
  const year = new Date().getFullYear()
  const rand = Math.floor(100000 + Math.random() * 900000)
  return `HM-${year}-${rand}`
}

export async function createBooking(userId: string, input: CreateBookingInput) {
  const { data: client } = await supabase
    .from('clients')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle()

  if (!client) return { success: false, error: 'Client profile not found', code: 'NOT_FOUND' }

  const { data: address } = await supabase
    .from('addresses')
    .select('id')
    .eq('id', input.addressId)
    .eq('client_id', client.id)
    .maybeSingle()

  if (!address) return { success: false, error: 'Address not found', code: 'NOT_FOUND' }

  const { data: category } = await supabase
    .from('service_categories')
    .select('id, base_price')
    .eq('id', input.serviceCategoryId)
    .eq('is_active', true)
    .maybeSingle()

  if (!category) return { success: false, error: 'Service category not found', code: 'NOT_FOUND' }

  if (input.professionalId) {
    const { data: pro } = await supabase
      .from('professionals')
      .select('id')
      .eq('id', input.professionalId)
      .eq('is_verified', true)
      .eq('is_available', true)
      .maybeSingle()

    if (!pro) return { success: false, error: 'Professional not available', code: 'NOT_FOUND' }
  }

  let bookingReference = generateBookingRef()
  while (true) {
    const { data: exists } = await supabase
      .from('bookings')
      .select('id')
      .eq('booking_reference', bookingReference)
      .maybeSingle()
    if (!exists) break
    bookingReference = generateBookingRef()
  }

  const { data: booking, error } = await supabase
    .from('bookings')
    .insert({
      booking_reference: bookingReference,
      client_id: client.id,
      professional_id: input.professionalId ?? null,
      service_category_id: input.serviceCategoryId,
      address_id: input.addressId,
      scheduled_date: input.scheduledDate,
      scheduled_time_start: input.scheduledTimeStart,
      client_description: input.clientDescription ?? null,
      estimated_price: category.base_price ?? 0,
      is_emergency: input.isEmergency ?? false,
    })
    .select(`
      *,
      service_categories(name, slug),
      addresses(label, city, address_line1),
      professionals(users(first_name, last_name, profile_photo_url))
    `)
    .single()

  if (error) return { success: false, error: error.message, code: 'SERVER_ERROR' }

  await supabase.from('booking_status_history').insert({
    booking_id: booking.id,
    new_status: 'PENDING',
    notes: 'Booking created',
  })

  await supabase
    .from('clients')
    .update({ total_bookings: (await supabase.from('clients').select('total_bookings').eq('id', client.id).single()).data?.total_bookings + 1 })
    .eq('id', client.id)

  return { success: true, booking: { ...booking, bookingReference: booking.booking_reference } }
}

export async function getClientBookings(userId: string, filter: 'upcoming' | 'past' | 'all' = 'all') {
  const { data: client } = await supabase
    .from('clients')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle()

  if (!client) return { success: true, bookings: [] }

  let query = supabase
    .from('bookings')
    .select(`
      *,
      service_categories(name, slug),
      addresses(label, city, address_line1),
      professionals(users(first_name, last_name, profile_photo_url))
    `)
    .eq('client_id', client.id)

  if (filter === 'upcoming') {
    query = query.in('status', ['PENDING', 'CONFIRMED', 'IN_PROGRESS'])
  } else if (filter === 'past') {
    query = query.in('status', ['COMPLETED', 'CANCELLED'])
  }

  query = query.order('scheduled_date', { ascending: filter !== 'past' })

  const { data: bookings, error } = await query
  if (error) return { success: false, error: error.message, code: 'SERVER_ERROR' }

  return { success: true, bookings }
}

export async function getBookingById(bookingId: string, userId: string) {
  const { data: client } = await supabase
    .from('clients')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle()

  const query = supabase
    .from('bookings')
    .select(`
      *,
      service_categories(*),
      addresses(*),
      professionals(users(first_name, last_name, profile_photo_url, phone)),
      booking_status_history(*),
      reviews(*),
      payments(*)
    `)
    .eq('id', bookingId)

  if (client) query.eq('client_id', client.id)

  const { data: booking, error } = await query.maybeSingle()
  if (error || !booking) return { success: false, error: 'Booking not found', code: 'NOT_FOUND' }
  return { success: true, booking }
}

export async function cancelBooking(bookingId: string, userId: string, input: CancelBookingInput) {
  const { data: client } = await supabase
    .from('clients')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle()

  if (!client) return { success: false, error: 'Client not found', code: 'NOT_FOUND' }

  const { data: booking } = await supabase
    .from('bookings')
    .select('id, status')
    .eq('id', bookingId)
    .eq('client_id', client.id)
    .maybeSingle()

  if (!booking) return { success: false, error: 'Booking not found', code: 'NOT_FOUND' }

  if (!['PENDING', 'CONFIRMED'].includes(booking.status)) {
    return { success: false, error: 'Booking cannot be cancelled at this stage', code: 'INVALID_STATUS' }
  }

  const { data: updated, error } = await supabase
    .from('bookings')
    .update({
      status: 'CANCELLED',
      cancellation_reason: input.reason,
      cancelled_by: 'CLIENT',
      cancelled_at: new Date().toISOString(),
    })
    .eq('id', bookingId)
    .select()
    .single()

  if (error) return { success: false, error: error.message, code: 'SERVER_ERROR' }

  await supabase.from('booking_status_history').insert({
    booking_id: bookingId,
    old_status: booking.status,
    new_status: 'CANCELLED',
    changed_by_user_id: userId,
    notes: input.reason,
  })

  return { success: true, booking: updated }
}

export async function acceptBooking(bookingId: string, userId: string) {
  const { data: professional } = await supabase
    .from('professionals')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle()

  if (!professional) return { success: false, error: 'Professional not found', code: 'NOT_FOUND' }

  const { data: booking } = await supabase
    .from('bookings')
    .select('id, status')
    .eq('id', bookingId)
    .eq('status', 'PENDING')
    .maybeSingle()

  if (!booking) return { success: false, error: 'Booking not available', code: 'INVALID_STATUS' }

  const { data: updated, error } = await supabase
    .from('bookings')
    .update({ professional_id: professional.id, status: 'CONFIRMED' })
    .eq('id', bookingId)
    .select()
    .single()

  if (error) return { success: false, error: error.message, code: 'SERVER_ERROR' }

  await supabase.from('booking_status_history').insert({
    booking_id: bookingId,
    old_status: 'PENDING',
    new_status: 'CONFIRMED',
    changed_by_user_id: userId,
  })

  return { success: true, booking: updated }
}

export async function startBooking(bookingId: string, userId: string) {
  const { data: professional } = await supabase
    .from('professionals')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle()

  if (!professional) return { success: false, error: 'Professional not found', code: 'NOT_FOUND' }

  const { data: booking } = await supabase
    .from('bookings')
    .select('id, status')
    .eq('id', bookingId)
    .eq('professional_id', professional.id)
    .eq('status', 'CONFIRMED')
    .maybeSingle()

  if (!booking) return { success: false, error: 'Booking not found', code: 'NOT_FOUND' }

  const { data: updated, error } = await supabase
    .from('bookings')
    .update({ status: 'IN_PROGRESS', actual_start_time: new Date().toISOString() })
    .eq('id', bookingId)
    .select()
    .single()

  if (error) return { success: false, error: error.message, code: 'SERVER_ERROR' }

  await supabase.from('booking_status_history').insert({
    booking_id: bookingId,
    old_status: 'CONFIRMED',
    new_status: 'IN_PROGRESS',
    changed_by_user_id: userId,
  })

  return { success: true, booking: updated }
}

export async function completeBooking(bookingId: string, userId: string, input: CompleteBookingInput) {
  const { data: professional } = await supabase
    .from('professionals')
    .select('id, platform_fee_percentage')
    .eq('user_id', userId)
    .maybeSingle()

  if (!professional) return { success: false, error: 'Professional not found', code: 'NOT_FOUND' }

  const { data: booking } = await supabase
    .from('bookings')
    .select('id, status, estimated_price, platform_fee_percentage')
    .eq('id', bookingId)
    .eq('professional_id', professional.id)
    .eq('status', 'IN_PROGRESS')
    .maybeSingle()

  if (!booking) return { success: false, error: 'Booking not found', code: 'NOT_FOUND' }

  const finalPrice = input.finalPrice ?? Number(booking.estimated_price)
  const platformFeeAmount = (finalPrice * Number(booking.platform_fee_percentage)) / 100
  const professionalEarnings = finalPrice - platformFeeAmount

  const { data: updated, error } = await supabase
    .from('bookings')
    .update({
      status: 'COMPLETED',
      actual_end_time: new Date().toISOString(),
      completed_at: new Date().toISOString(),
      final_price: finalPrice,
      price_adjustment_reason: input.priceAdjustmentReason ?? null,
      professional_notes: input.professionalNotes ?? null,
      platform_fee_amount: platformFeeAmount,
      professional_earnings: professionalEarnings,
    })
    .eq('id', bookingId)
    .select()
    .single()

  if (error) return { success: false, error: error.message, code: 'SERVER_ERROR' }

  await supabase.from('booking_status_history').insert({
    booking_id: bookingId,
    old_status: 'IN_PROGRESS',
    new_status: 'COMPLETED',
    changed_by_user_id: userId,
  })

  const { data: pro } = await supabase
    .from('professionals')
    .select('total_jobs_completed, total_earnings, available_balance')
    .eq('id', professional.id)
    .single()

  if (pro) {
    await supabase.from('professionals').update({
      total_jobs_completed: pro.total_jobs_completed + 1,
      total_earnings: Number(pro.total_earnings) + professionalEarnings,
      available_balance: Number(pro.available_balance) + professionalEarnings,
    }).eq('id', professional.id)
  }

  return { success: true, booking: updated }
}

export async function getClientAddresses(userId: string) {
  const { data: client } = await supabase
    .from('clients')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle()

  if (!client) return { success: false, error: 'Client not found', code: 'NOT_FOUND' }

  const { data: addresses, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('client_id', client.id)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: true })

  if (error) return { success: false, error: error.message, code: 'SERVER_ERROR' }
  return { success: true, addresses }
}

export async function createClientAddress(userId: string, input: CreateAddressInput) {
  const { data: client } = await supabase
    .from('clients')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle()

  if (!client) return { success: false, error: 'Client not found', code: 'NOT_FOUND' }

  if (input.isDefault) {
    await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('client_id', client.id)
  }

  const { data: address, error } = await supabase
    .from('addresses')
    .insert({
      client_id: client.id,
      label: input.label,
      address_line1: input.addressLine1,
      address_line2: input.addressLine2 ?? null,
      city: input.city,
      province: input.province,
      postal_code: input.postalCode,
      country: input.country ?? 'South Africa',
      latitude: input.latitude ?? null,
      longitude: input.longitude ?? null,
      special_instructions: input.specialInstructions ?? null,
      is_default: input.isDefault ?? false,
    })
    .select()
    .single()

  if (error) return { success: false, error: error.message, code: 'SERVER_ERROR' }
  return { success: true, address }
}
