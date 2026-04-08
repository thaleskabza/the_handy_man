'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { apiFetch } from '@/lib/auth'

const RATINGS = [1, 2, 3, 4, 5]

function StarPicker({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex gap-1">
        {RATINGS.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => onChange(r)}
            className={`text-2xl transition-colors ${r <= value ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400`}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  )
}

export default function ReviewPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [overall, setOverall] = useState(0)
  const [punctuality, setPunctuality] = useState(0)
  const [quality, setQuality] = useState(0)
  const [professionalism, setProfessionalism] = useState(0)
  const [value, setValue] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [wouldRecommend, setWouldRecommend] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (overall === 0) { setError('Please select an overall rating.'); return }

    setIsSubmitting(true)
    setError('')

    const res = await apiFetch('/reviews', {
      method: 'POST',
      body: JSON.stringify({
        bookingId: id,
        overallRating: overall,
        ...(punctuality > 0 && { punctualityRating: punctuality }),
        ...(quality > 0 && { qualityRating: quality }),
        ...(professionalism > 0 && { professionalismRating: professionalism }),
        ...(value > 0 && { valueRating: value }),
        reviewText: reviewText || undefined,
        wouldRecommend,
      }),
    })

    const data = await res.json()

    if (data.success) {
      router.push(`/bookings/${id}`)
    } else {
      setError(data.error || 'Failed to submit review.')
      setIsSubmitting(false)
    }
  }

  return (
    <main className="max-w-lg mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/bookings/${id}`} className="text-gray-400 hover:text-gray-600 text-sm">←</Link>
        <h1 className="text-xl font-bold">Leave a Review</h1>
      </div>

      <form onSubmit={onSubmit} className="bg-white rounded-xl border border-gray-100 p-6 space-y-6">
        <StarPicker label="Overall Rating *" value={overall} onChange={setOverall} />
        <StarPicker label="Punctuality" value={punctuality} onChange={setPunctuality} />
        <StarPicker label="Quality of Work" value={quality} onChange={setQuality} />
        <StarPicker label="Professionalism" value={professionalism} onChange={setProfessionalism} />
        <StarPicker label="Value for Money" value={value} onChange={setValue} />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Review <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            maxLength={500}
            rows={4}
            placeholder="Tell others about your experience..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-400 text-right mt-1">{reviewText.length}/500</p>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={wouldRecommend}
            onChange={(e) => setWouldRecommend(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm text-gray-700">I would recommend this professional</span>
        </label>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </main>
  )
}
