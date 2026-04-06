'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { BookingDraft } from '../page'

const TIME_SLOTS = [
  '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
]

interface Props {
  draft: BookingDraft
  update: (p: Partial<BookingDraft>) => void
  onNext: () => void
  onBack: () => void
}

function toDateString(d: Date) {
  return d.toISOString().split('T')[0]
}

export default function StepDateTime({ draft, update, onNext, onBack }: Props) {
  const today = toDateString(new Date())
  const tomorrow = toDateString(new Date(Date.now() + 86400000))

  const [error, setError] = useState('')

  const handleNext = () => {
    if (!draft.scheduledDate) { setError('Please select a date'); return }
    if (!draft.scheduledTimeStart) { setError('Please select a time'); return }
    setError('')
    onNext()
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-1">When do you need it?</h2>
      <p className="text-gray-500 text-sm mb-5">Pick a date and time</p>

      {/* Quick date select */}
      <div className="flex gap-2 mb-4">
        {[{ label: 'Today', value: today }, { label: 'Tomorrow', value: tomorrow }].map((opt) => (
          <button
            key={opt.value}
            onClick={() => update({ scheduledDate: opt.value })}
            className={`flex-1 py-2 rounded-lg text-sm font-medium border-2 transition-all ${
              draft.scheduledDate === opt.value
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-100 hover:border-blue-200'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Calendar date picker */}
      <div className="mb-5">
        <label className="block text-xs font-medium text-gray-600 mb-1">Or pick a date</label>
        <input
          type="date"
          min={today}
          value={draft.scheduledDate}
          onChange={(e) => update({ scheduledDate: e.target.value })}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Time slots */}
      <div className="mb-5">
        <label className="block text-xs font-medium text-gray-600 mb-2">Select time</label>
        <div className="grid grid-cols-4 gap-2">
          {TIME_SLOTS.map((t) => (
            <button
              key={t}
              onClick={() => update({ scheduledTimeStart: t })}
              className={`py-2 rounded-lg text-xs font-medium border-2 transition-all ${
                draft.scheduledTimeStart === t
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-100 hover:border-blue-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <div className="flex gap-2">
        <Button variant="outline" onClick={onBack} className="flex-1">Back</Button>
        <Button onClick={handleNext} className="flex-1">Continue</Button>
      </div>
    </div>
  )
}
