'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { apiFetch } from '@/lib/auth'

// ── Step components ────────────────────────────────────────────────────────────
import StepService from './steps/StepService'
import StepAddress from './steps/StepAddress'
import StepDateTime from './steps/StepDateTime'
import StepDescription from './steps/StepDescription'
import StepProfessionals from './steps/StepProfessionals'
import StepPriceEstimate from './steps/StepPriceEstimate'
import StepConfirm from './steps/StepConfirm'
import BookingConfirmation from './steps/BookingConfirmation'

// ── Types ──────────────────────────────────────────────────────────────────────
export interface BookingDraft {
  serviceCategoryId: string
  serviceName: string
  serviceSlug: string
  basePrice: number | null
  addressId: string
  addressLabel: string
  addressLine: string
  scheduledDate: string
  scheduledTimeStart: string
  clientDescription: string
  professionalId: string | null
  professionalName: string | null
  professionalRating: number | null
  professionalRate: number | null
  isEmergency: boolean
}

const EMPTY_DRAFT: BookingDraft = {
  serviceCategoryId: '',
  serviceName: '',
  serviceSlug: '',
  basePrice: null,
  addressId: '',
  addressLabel: '',
  addressLine: '',
  scheduledDate: '',
  scheduledTimeStart: '',
  clientDescription: '',
  professionalId: null,
  professionalName: null,
  professionalRating: null,
  professionalRate: null,
  isEmergency: false,
}

const STEPS = [
  'Service',
  'Address',
  'Date & Time',
  'Description',
  'Professional',
  'Price',
  'Confirm',
]

export default function BookingPage() {
  const router = useRouter()
  const params = useSearchParams()
  const preselectedSlug = params.get('service') ?? ''

  const [step, setStep] = useState(1)
  const [draft, setDraft] = useState<BookingDraft>({ ...EMPTY_DRAFT, serviceSlug: preselectedSlug })
  const [confirmedBooking, setConfirmedBooking] = useState<{ id: string; reference: string } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  // Persist draft across page refreshes
  useEffect(() => {
    const saved = sessionStorage.getItem('booking_draft')
    if (saved) {
      try { setDraft(JSON.parse(saved)) } catch {}
    }
  }, [])

  useEffect(() => {
    sessionStorage.setItem('booking_draft', JSON.stringify(draft))
  }, [draft])

  const update = useCallback((patch: Partial<BookingDraft>) => {
    setDraft((d) => ({ ...d, ...patch }))
  }, [])

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length))
  const prev = () => setStep((s) => Math.max(s - 1, 1))

  const submit = async () => {
    setIsSubmitting(true)
    setSubmitError('')

    try {
      const res = await apiFetch('/bookings', {
        method: 'POST',
        body: JSON.stringify({
          serviceCategoryId: draft.serviceCategoryId,
          addressId: draft.addressId,
          scheduledDate: draft.scheduledDate,
          scheduledTimeStart: draft.scheduledTimeStart,
          clientDescription: draft.clientDescription || undefined,
          professionalId: draft.professionalId || undefined,
          isEmergency: draft.isEmergency,
        }),
      })

      const data = await res.json()

      if (data.success) {
        sessionStorage.removeItem('booking_draft')
        setConfirmedBooking({ id: data.booking.id, reference: data.booking.bookingReference })
      } else {
        setSubmitError(data.error || 'Booking failed. Please try again.')
      }
    } catch {
      setSubmitError('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // ── Confirmed screen ──────────────────────────────────────────────────────────
  if (confirmedBooking) {
    return <BookingConfirmation booking={confirmedBooking} draft={draft} />
  }

  const progressPct = Math.round((step / STEPS.length) * 100)

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-xl mx-auto">

        {/* Progress header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Step {step} of {STEPS.length} — {STEPS[step - 1]}
            </span>
            <button
              onClick={() => router.push('/services')}
              className="text-sm text-gray-400 hover:text-gray-600"
            >
              Cancel
            </button>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Step content */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          {step === 1 && (
            <StepService draft={draft} update={update} onNext={next} />
          )}
          {step === 2 && (
            <StepAddress draft={draft} update={update} onNext={next} onBack={prev} />
          )}
          {step === 3 && (
            <StepDateTime draft={draft} update={update} onNext={next} onBack={prev} />
          )}
          {step === 4 && (
            <StepDescription draft={draft} update={update} onNext={next} onBack={prev} />
          )}
          {step === 5 && (
            <StepProfessionals draft={draft} update={update} onNext={next} onBack={prev} />
          )}
          {step === 6 && (
            <StepPriceEstimate draft={draft} onNext={next} onBack={prev} />
          )}
          {step === 7 && (
            <StepConfirm
              draft={draft}
              onBack={prev}
              onSubmit={submit}
              isSubmitting={isSubmitting}
              error={submitError}
            />
          )}
        </div>
      </div>
    </div>
  )
}
