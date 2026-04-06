'use client'

import Link from 'next/link'
import type { BookingDraft } from '../page'

interface Props {
  booking: { id: string; reference: string }
  draft: BookingDraft
}

export default function BookingConfirmation({ booking, draft }: Props) {
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-ZA', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm p-8 text-center">

        {/* Success icon */}
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-1">Booking Confirmed!</h1>
        <p className="text-gray-500 text-sm mb-6">
          We&apos;ll notify you as soon as a professional accepts your job.
        </p>

        {/* Reference */}
        <div className="bg-blue-50 rounded-xl p-4 mb-6">
          <p className="text-xs text-blue-600 font-medium mb-1">Booking Reference</p>
          <p className="text-xl font-bold text-blue-800 tracking-wider">{booking.reference}</p>
        </div>

        {/* Summary */}
        <div className="text-left bg-gray-50 rounded-xl p-4 mb-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Service</span>
            <span className="font-medium">{draft.serviceName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Date</span>
            <span className="font-medium">{draft.scheduledDate ? formatDate(draft.scheduledDate) : '—'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Time</span>
            <span className="font-medium">{draft.scheduledTimeStart}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Address</span>
            <span className="font-medium text-right">{draft.addressLabel}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Link
            href={`/bookings/${booking.id}`}
            className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            View Booking
          </Link>
          <Link
            href="/bookings"
            className="w-full py-2.5 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            My Bookings
          </Link>
          <Link
            href="/services"
            className="text-sm text-gray-400 hover:text-gray-600 pt-1"
          >
            Book another service
          </Link>
        </div>
      </div>
    </div>
  )
}
