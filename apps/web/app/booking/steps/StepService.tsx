'use client'

import { useEffect, useState } from 'react'
import type { BookingDraft } from '../page'

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  basePrice: string | null
  estimatedDurationHours: string | null
}

const ICONS: Record<string, string> = {
  plumbing: '🔧', painting: '🎨', carpentry: '🪚',
  tiling: '🪟', electrical: '⚡', cleaning: '🧹', 'general-repairs': '🔨',
}

interface Props {
  draft: BookingDraft
  update: (p: Partial<BookingDraft>) => void
  onNext: () => void
}

export default function StepService({ draft, update, onNext }: Props) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'}/service-categories`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setCategories(d.categories) })
      .finally(() => setLoading(false))
  }, [])

  const select = (cat: Category) => {
    update({
      serviceCategoryId: cat.id,
      serviceName: cat.name,
      serviceSlug: cat.slug,
      basePrice: cat.basePrice ? Number(cat.basePrice) : null,
    })
    onNext()
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-1">What service do you need?</h2>
      <p className="text-gray-500 text-sm mb-5">Select one to continue</p>

      {loading ? (
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-20 rounded-lg bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => select(cat)}
              className={`text-left p-4 rounded-lg border-2 transition-all ${
                draft.serviceCategoryId === cat.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-100 hover:border-blue-200 bg-white'
              }`}
            >
              <div className="text-2xl mb-1">{ICONS[cat.slug] ?? '🛠️'}</div>
              <div className="font-medium text-sm">{cat.name}</div>
              {cat.basePrice && (
                <div className="text-xs text-gray-400 mt-0.5">From R{Number(cat.basePrice).toFixed(0)}</div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
