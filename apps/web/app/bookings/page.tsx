'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { apiFetch, isLoggedIn } from '@/lib/auth'

interface Booking {
  id: string
  bookingReference: string
  status: string
  scheduledDate: string
  scheduledTimeStart: string
  estimatedPrice: string
  serviceCategory: { name: string; slug: string }
  address: { label: string; city: string; addressLine1: string }
  professional: {
    user: { firstName: string; lastName: string; profilePhotoUrl: string | null }
  } | null
}

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  IN_PROGRESS: 'bg-purple-100 text-purple-700',
  COMPLETED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-gray-100 text-gray-500',
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pending', CONFIRMED: 'Confirmed', IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed', CANCELLED: 'Cancelled',
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-ZA', { weekday: 'short', month: 'short', day: 'numeric' })
}

export default function BookingsPage() {
  const router = useRouter()
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoggedIn()) { router.push('/auth/login'); return }

    setLoading(true)
    apiFetch(`/bookings?filter=${tab}`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setBookings(d.bookings) })
      .finally(() => setLoading(false))
  }, [tab, router])

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Bookings</h1>
        <Link
          href="/booking"
          className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + New Booking
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {(['upcoming', 'past'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors ${
              tab === t ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-24 rounded-xl bg-gray-100 animate-pulse" />)}
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">📋</p>
          <p className="text-gray-500 mb-4">
            {tab === 'upcoming' ? 'No upcoming bookings.' : 'No past bookings yet.'}
          </p>
          <Link href="/booking" className="text-blue-600 hover:underline text-sm">
            Book a service
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <Link
              key={b.id}
              href={`/bookings/${b.id}`}
              className="block bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="font-semibold">{b.serviceCategory.name}</span>
                  <span className={`ml-2 text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[b.status] ?? 'bg-gray-100 text-gray-500'}`}>
                    {STATUS_LABELS[b.status] ?? b.status}
                  </span>
                </div>
                <span className="text-sm font-bold text-blue-600">R{Number(b.estimatedPrice).toFixed(0)}</span>
              </div>

              <div className="text-xs text-gray-500 space-y-0.5">
                <p>📅 {formatDate(b.scheduledDate)} at {b.scheduledTimeStart}</p>
                <p>📍 {b.address.label} — {b.address.addressLine1}, {b.address.city}</p>
                {b.professional
                  ? <p>👷 {b.professional.user.firstName} {b.professional.user.lastName}</p>
                  : <p className="text-yellow-600">👷 Awaiting professional</p>
                }
                <p className="text-gray-400">Ref: {b.bookingReference}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
