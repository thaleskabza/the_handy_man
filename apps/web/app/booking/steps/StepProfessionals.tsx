'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import type { BookingDraft } from '../page'

interface Pro {
  id: string
  averageRating: string | null
  totalReviews: number
  hourlyRate: string | null
  totalJobsCompleted: number
  user: { firstName: string; lastName: string; profilePhotoUrl: string | null }
  services: { serviceCategory: { name: string } }[]
}

interface Props {
  draft: BookingDraft
  update: (p: Partial<BookingDraft>) => void
  onNext: () => void
  onBack: () => void
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-yellow-400 text-xs">
      {'★'.repeat(Math.round(rating))}{'☆'.repeat(5 - Math.round(rating))}
    </span>
  )
}

export default function StepProfessionals({ draft, update, onNext, onBack }: Props) {
  const [pros, setPros] = useState<Pro[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'}/professionals?serviceCategoryId=${draft.serviceCategoryId}`
    fetch(url)
      .then((r) => r.json())
      .then((d) => { if (d.success) setPros(d.professionals) })
      .finally(() => setLoading(false))
  }, [draft.serviceCategoryId])

  const select = (pro: Pro | null) => {
    if (pro) {
      update({
        professionalId: pro.id,
        professionalName: `${pro.user.firstName} ${pro.user.lastName}`,
        professionalRating: pro.averageRating ? Number(pro.averageRating) : null,
        professionalRate: pro.hourlyRate ? Number(pro.hourlyRate) : null,
      })
    } else {
      update({ professionalId: null, professionalName: null, professionalRating: null, professionalRate: null })
    }
    onNext()
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-1">Choose a professional</h2>
      <p className="text-gray-500 text-sm mb-5">Or skip — we'll find the best available one for you</p>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-20 rounded-lg bg-gray-100 animate-pulse" />)}
        </div>
      ) : pros.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="mb-4">No professionals available right now.</p>
          <Button onClick={() => select(null)}>Continue anyway</Button>
        </div>
      ) : (
        <div className="space-y-2 mb-4">
          {pros.map((pro) => {
            const name = `${pro.user.firstName} ${pro.user.lastName}`
            const rating = pro.averageRating ? Number(pro.averageRating) : 0
            return (
              <button
                key={pro.id}
                onClick={() => select(pro)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  draft.professionalId === pro.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-100 hover:border-blue-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-sm flex-shrink-0">
                    {pro.user.profilePhotoUrl
                      ? <img src={pro.user.profilePhotoUrl} alt={name} className="w-10 h-10 rounded-full object-cover" />
                      : name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{name}</span>
                      {rating > 0 && <Stars rating={rating} />}
                    </div>
                    <p className="text-xs text-gray-400">
                      {pro.totalJobsCompleted} jobs · {pro.totalReviews} reviews
                      {pro.hourlyRate ? ` · R${Number(pro.hourlyRate).toFixed(0)}/hr` : ''}
                    </p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      )}

      <div className="flex gap-2 mt-2">
        <Button variant="outline" onClick={onBack} className="flex-1">Back</Button>
        <Button variant="outline" onClick={() => select(null)} className="flex-1">Skip — any pro</Button>
      </div>
    </div>
  )
}
