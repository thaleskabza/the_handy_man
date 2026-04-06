'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { apiFetch, isLoggedIn } from '@/lib/auth'

interface BookingDetail {
  id: string
  bookingReference: string
  status: string
  scheduledDate: string
  scheduledTimeStart: string
  estimatedPrice: string
  finalPrice: string | null
  clientDescription: string | null
  isEmergency: boolean
  createdAt: string
  serviceCategory: { name: string; slug: string }
  address: {
    label: string
    addressLine1: string
    addressLine2: string | null
    city: string
    province: string
    postalCode: string
    specialInstructions: string | null
  }
  professional: {
    id: string
    averageRating: string | null
    totalJobsCompleted: number
    user: { firstName: string; lastName: string; phone: string | null; profilePhotoUrl: string | null }
  } | null
  statusHistory: { id: string; newStatus: string; notes: string | null; createdAt: string }[]
  review: { overallRating: number; reviewText: string | null } | null
}

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  IN_PROGRESS: 'bg-purple-100 text-purple-700',
  COMPLETED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-gray-100 text-gray-500',
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-ZA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

function Stars({ rating }: { rating: number }) {
  return <span className="text-yellow-400">{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</span>
}

export default function BookingDetailPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const [booking, setBooking] = useState<BookingDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)
  const [cancelError, setCancelError] = useState('')

  useEffect(() => {
    if (!isLoggedIn()) { router.push('/auth/login'); return }

    apiFetch(`/bookings/${id}`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setBooking(d.booking) })
      .finally(() => setLoading(false))
  }, [id, router])

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this booking?')) return
    setCancelling(true)
    setCancelError('')

    const res = await apiFetch(`/bookings/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason: 'Cancelled by client' }),
    })
    const data = await res.json()

    if (data.success) {
      setBooking((b) => b ? { ...b, status: 'CANCELLED' } : b)
    } else {
      setCancelError(data.error || 'Failed to cancel')
    }
    setCancelling(false)
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
        {[1, 2, 3].map((i) => <div key={i} className="h-24 rounded-xl bg-gray-100 animate-pulse" />)}
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-500 mb-4">Booking not found.</p>
        <Link href="/bookings" className="text-blue-600 hover:underline">← My Bookings</Link>
      </div>
    )
  }

  const canCancel = ['PENDING', 'CONFIRMED'].includes(booking.status)
  const price = booking.finalPrice ?? booking.estimatedPrice

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/bookings" className="text-gray-400 hover:text-gray-600 text-sm">←</Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold">{booking.serviceCategory.name}</h1>
          <p className="text-xs text-gray-400">Ref: {booking.bookingReference}</p>
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_STYLES[booking.status] ?? 'bg-gray-100'}`}>
          {booking.status.replace('_', ' ')}
        </span>
      </div>

      {/* Key info */}
      <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50 mb-4">
        <div className="p-4 flex justify-between text-sm">
          <span className="text-gray-500">Date & Time</span>
          <span className="font-medium text-right">{formatDate(booking.scheduledDate)}<br />{booking.scheduledTimeStart}</span>
        </div>
        <div className="p-4 flex justify-between text-sm">
          <span className="text-gray-500">Address</span>
          <span className="font-medium text-right">
            {booking.address.label}<br />
            {booking.address.addressLine1}, {booking.address.city}
          </span>
        </div>
        <div className="p-4 flex justify-between text-sm">
          <span className="text-gray-500">{booking.finalPrice ? 'Final Price' : 'Estimated Price'}</span>
          <span className="font-bold text-blue-600">R{Number(price).toFixed(0)}</span>
        </div>
        {booking.isEmergency && (
          <div className="p-4 text-sm text-red-600 font-medium">🚨 Emergency booking</div>
        )}
        {booking.clientDescription && (
          <div className="p-4 text-sm">
            <p className="text-gray-500 mb-1">Your notes</p>
            <p className="text-gray-700">{booking.clientDescription}</p>
          </div>
        )}
      </div>

      {/* Professional */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4">
        <h2 className="text-sm font-semibold text-gray-500 mb-3">Professional</h2>
        {booking.professional ? (
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-lg font-bold text-gray-500 flex-shrink-0">
              {booking.professional.user.profilePhotoUrl
                ? <img src={booking.professional.user.profilePhotoUrl} className="w-12 h-12 rounded-full object-cover" alt="" />
                : booking.professional.user.firstName[0]}
            </div>
            <div className="flex-1">
              <p className="font-medium">{booking.professional.user.firstName} {booking.professional.user.lastName}</p>
              {booking.professional.averageRating && (
                <div className="flex items-center gap-1">
                  <Stars rating={Math.round(Number(booking.professional.averageRating))} />
                  <span className="text-xs text-gray-400">{booking.professional.averageRating}</span>
                </div>
              )}
              <p className="text-xs text-gray-400">{booking.professional.totalJobsCompleted} jobs completed</p>
            </div>
            {booking.professional.user.phone && (
              <a
                href={`tel:${booking.professional.user.phone}`}
                className="text-blue-600 text-sm font-medium hover:underline"
              >
                Call
              </a>
            )}
          </div>
        ) : (
          <p className="text-sm text-yellow-600">Awaiting a professional to accept your booking.</p>
        )}
      </div>

      {/* Review (if completed) */}
      {booking.status === 'COMPLETED' && (
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4">
          <h2 className="text-sm font-semibold text-gray-500 mb-3">Review</h2>
          {booking.review ? (
            <div>
              <Stars rating={booking.review.overallRating} />
              {booking.review.reviewText && <p className="text-sm text-gray-600 mt-1">{booking.review.reviewText}</p>}
            </div>
          ) : (
            <Link
              href={`/bookings/${booking.id}/review`}
              className="text-sm text-blue-600 hover:underline"
            >
              Leave a review →
            </Link>
          )}
        </div>
      )}

      {/* Status history */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
        <h2 className="text-sm font-semibold text-gray-500 mb-3">Status History</h2>
        <div className="space-y-2">
          {booking.statusHistory.map((h) => (
            <div key={h.id} className="flex items-start gap-3 text-xs">
              <div className="w-2 h-2 rounded-full bg-blue-400 mt-1 flex-shrink-0" />
              <div>
                <span className="font-medium">{h.newStatus.replace('_', ' ')}</span>
                {h.notes && <span className="text-gray-400"> — {h.notes}</span>}
                <p className="text-gray-400">{new Date(h.createdAt).toLocaleString('en-ZA')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      {cancelError && <p className="text-red-500 text-sm mb-3">{cancelError}</p>}
      {canCancel && (
        <button
          onClick={handleCancel}
          disabled={cancelling}
          className="w-full py-2.5 border border-red-200 text-red-600 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors disabled:opacity-50"
        >
          {cancelling ? 'Cancelling...' : 'Cancel Booking'}
        </button>
      )}
    </main>
  )
}
