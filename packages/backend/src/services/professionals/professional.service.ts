/**
 * Professional Service
 */

import { supabase } from '../../lib/supabase/client'
import type {
  UpdateProfessionalProfileInput,
  SetProfessionalServicesInput,
  SetAvailabilityInput,
  BlockDateInput,
  ProfessionalSearchInput,
  SubmitApplicationInput,
  ReviewApplicationInput,
} from '@handy-man/shared/validators'

export async function getProfessionalProfile(professionalId: string) {
  const { data } = await supabase
    .from('professionals')
    .select(`
      *,
      users(id, first_name, last_name, email, phone, profile_photo_url),
      professional_services(*, service_categories(*)),
      professional_availability(*)
    `)
    .eq('id', professionalId)
    .order('day_of_week', { referencedTable: 'professional_availability', ascending: true })
    .maybeSingle()

  return data
}

export async function getProfessionalByUserId(userId: string) {
  const { data } = await supabase
    .from('professionals')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  return data
}

export async function updateProfile(professionalId: string, input: UpdateProfessionalProfileInput) {
  const { data: existing } = await supabase
    .from('professionals')
    .select('id')
    .eq('id', professionalId)
    .maybeSingle()

  if (!existing) return { success: false, error: 'Professional not found', code: 'NOT_FOUND' }

  const { data: professional, error } = await supabase
    .from('professionals')
    .update({
      ...(input.bio !== undefined && { bio: input.bio }),
      ...(input.yearsExperience !== undefined && { years_experience: input.yearsExperience }),
      ...(input.serviceRadiusKm !== undefined && { service_radius_km: input.serviceRadiusKm }),
      ...(input.hourlyRate !== undefined && { hourly_rate: input.hourlyRate }),
      ...(input.isAvailable !== undefined && { is_available: input.isAvailable }),
      ...(input.isOnVacation !== undefined && { is_on_vacation: input.isOnVacation }),
      ...(input.baseLocationLat !== undefined && { base_location_lat: input.baseLocationLat }),
      ...(input.baseLocationLng !== undefined && { base_location_lng: input.baseLocationLng }),
    })
    .eq('id', professionalId)
    .select()
    .single()

  if (error) return { success: false, error: error.message, code: 'SERVER_ERROR' }
  return { success: true, professional }
}

export async function setProfessionalServices(professionalId: string, input: SetProfessionalServicesInput) {
  const { data: existing } = await supabase
    .from('professionals')
    .select('id')
    .eq('id', professionalId)
    .maybeSingle()

  if (!existing) return { success: false, error: 'Professional not found', code: 'NOT_FOUND' }

  const categoryIds = input.services.map((s) => s.serviceCategoryId)
  const { data: foundCategories } = await supabase
    .from('service_categories')
    .select('id')
    .in('id', categoryIds)
    .eq('is_active', true)

  if (!foundCategories || foundCategories.length !== categoryIds.length) {
    return { success: false, error: 'One or more service categories not found', code: 'NOT_FOUND' }
  }

  await supabase.from('professional_services').delete().eq('professional_id', professionalId)

  const { error } = await supabase.from('professional_services').insert(
    input.services.map((s) => ({
      professional_id: professionalId,
      service_category_id: s.serviceCategoryId,
      custom_rate: s.customRate ?? null,
      years_experience: s.yearsExperience ?? null,
      is_primary_service: s.isPrimaryService ?? false,
    }))
  )

  if (error) return { success: false, error: error.message, code: 'SERVER_ERROR' }
  return { success: true }
}

export async function setAvailability(professionalId: string, input: SetAvailabilityInput) {
  const { data: existing } = await supabase
    .from('professionals')
    .select('id')
    .eq('id', professionalId)
    .maybeSingle()

  if (!existing) return { success: false, error: 'Professional not found', code: 'NOT_FOUND' }

  for (const day of input.availability) {
    await supabase
      .from('professional_availability')
      .upsert({
        professional_id: professionalId,
        day_of_week: day.dayOfWeek,
        start_time: day.startTime,
        end_time: day.endTime,
        is_available: day.isAvailable,
      }, { onConflict: 'professional_id,day_of_week' })
  }

  return { success: true }
}

export async function addBlockedDate(professionalId: string, input: BlockDateInput) {
  const { data: existing } = await supabase
    .from('professionals')
    .select('id')
    .eq('id', professionalId)
    .maybeSingle()

  if (!existing) return { success: false, error: 'Professional not found', code: 'NOT_FOUND' }

  const { data: blocked, error } = await supabase
    .from('professional_blocked_dates')
    .insert({
      professional_id: professionalId,
      blocked_date: input.blockedDate,
      reason: input.reason ?? null,
    })
    .select()
    .single()

  if (error) return { success: false, error: error.message, code: 'SERVER_ERROR' }
  return { success: true, blocked }
}

export async function removeBlockedDate(professionalId: string, blockedDateId: string) {
  const { data: record } = await supabase
    .from('professional_blocked_dates')
    .select('id')
    .eq('id', blockedDateId)
    .eq('professional_id', professionalId)
    .maybeSingle()

  if (!record) return { success: false, error: 'Blocked date not found', code: 'NOT_FOUND' }

  await supabase.from('professional_blocked_dates').delete().eq('id', blockedDateId)
  return { success: true }
}

export async function submitApplication(userId: string, input: SubmitApplicationInput) {
  const { data: professional } = await supabase
    .from('professionals')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle()

  if (!professional) return { success: false, error: 'Professional profile not found', code: 'NOT_FOUND' }

  const { data: existing } = await supabase
    .from('applications')
    .select('id')
    .eq('professional_id', professional.id)
    .in('status', ['PENDING', 'UNDER_REVIEW'])
    .maybeSingle()

  if (existing) {
    return { success: false, error: 'You already have a pending application', code: 'DUPLICATE' }
  }

  const { data: application, error } = await supabase
    .from('applications')
    .insert({
      professional_id: professional.id,
      years_experience: input.yearsExperience,
      selected_categories: input.selectedCategories,
      id_document_url: input.idDocumentUrl ?? null,
      certifications_urls: input.certificationsUrls ?? [],
      references_urls: input.referencesUrls ?? [],
      agreed_to_background_check: input.agreedToBackgroundCheck,
    })
    .select()
    .single()

  if (error) return { success: false, error: error.message, code: 'SERVER_ERROR' }
  return { success: true, application }
}

export async function getMyApplication(userId: string) {
  const { data: professional } = await supabase
    .from('professionals')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle()

  if (!professional) return { success: false, error: 'Professional profile not found', code: 'NOT_FOUND' }

  const { data: application } = await supabase
    .from('applications')
    .select('*')
    .eq('professional_id', professional.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  return { success: true, application }
}

export async function listApplications(status?: string) {
  let query = supabase
    .from('applications')
    .select(`*, professionals(*, users(id, first_name, last_name, email, phone))`)
    .order('created_at', { ascending: true })

  if (status) query = query.eq('status', status)

  const { data: applications, error } = await query
  if (error) return { success: false, error: error.message, code: 'SERVER_ERROR' }
  return { success: true, applications }
}

export async function reviewApplication(applicationId: string, adminUserId: string, input: ReviewApplicationInput) {
  const { data: application } = await supabase
    .from('applications')
    .select('id, status, professional_id')
    .eq('id', applicationId)
    .maybeSingle()

  if (!application) return { success: false, error: 'Application not found', code: 'NOT_FOUND' }
  if (application.status === 'APPROVED' || application.status === 'REJECTED') {
    return { success: false, error: 'Application already reviewed', code: 'INVALID_STATUS' }
  }

  const { data: updated, error } = await supabase
    .from('applications')
    .update({
      status: input.status,
      admin_notes: input.adminNotes ?? null,
      rejection_reason: input.rejectionReason ?? null,
      reviewed_by_admin_id: adminUserId,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', applicationId)
    .select()
    .single()

  if (error) return { success: false, error: error.message, code: 'SERVER_ERROR' }

  if (input.status === 'APPROVED') {
    await supabase
      .from('professionals')
      .update({ is_verified: true, verification_date: new Date().toISOString() })
      .eq('id', application.professional_id)
  }

  return { success: true, application: updated }
}

export async function searchProfessionals(input: ProfessionalSearchInput) {
  const { serviceCategoryId, page, limit } = input
  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = supabase
    .from('professionals')
    .select(`
      *,
      users(first_name, last_name, profile_photo_url),
      professional_services(*, service_categories(name, slug))
    `, { count: 'exact' })
    .eq('is_verified', true)
    .eq('is_available', true)
    .eq('is_on_vacation', false)
    .order('average_rating', { ascending: false })
    .order('total_jobs_completed', { ascending: false })
    .range(from, to)

  if (serviceCategoryId) {
    query = query.eq('professional_services.service_category_id', serviceCategoryId)
  }

  const { data: professionals, count, error } = await query
  if (error) return { professionals: [], pagination: { total: 0, page, limit, totalPages: 0 } }

  return {
    professionals,
    pagination: {
      total: count ?? 0,
      page,
      limit,
      totalPages: Math.ceil((count ?? 0) / limit),
    },
  }
}
