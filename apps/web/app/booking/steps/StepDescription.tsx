'use client'

import { Button } from '@/components/ui/button'
import type { BookingDraft } from '../page'

interface Props {
  draft: BookingDraft
  update: (p: Partial<BookingDraft>) => void
  onNext: () => void
  onBack: () => void
}

const MAX = 500

export default function StepDescription({ draft, update, onNext, onBack }: Props) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-1">Describe the job</h2>
      <p className="text-gray-500 text-sm mb-5">Optional — but helps professionals arrive prepared</p>

      <textarea
        value={draft.clientDescription}
        onChange={(e) => update({ clientDescription: e.target.value.slice(0, MAX) })}
        placeholder="e.g. Kitchen tap is dripping. Water pressure seems fine. Tap is about 3 years old."
        rows={5}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      />
      <p className="text-xs text-gray-400 text-right mt-1">{draft.clientDescription.length}/{MAX}</p>

      <label className="flex items-center gap-2 mt-4 cursor-pointer">
        <input
          type="checkbox"
          checked={draft.isEmergency}
          onChange={(e) => update({ isEmergency: e.target.checked })}
          className="rounded"
        />
        <span className="text-sm font-medium text-red-600">🚨 This is an emergency</span>
      </label>

      <div className="flex gap-2 mt-6">
        <Button variant="outline" onClick={onBack} className="flex-1">Back</Button>
        <Button onClick={onNext} className="flex-1">Continue</Button>
      </div>
    </div>
  )
}
