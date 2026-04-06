'use client'

import { Button } from '@/components/ui/button'
import type { BookingDraft } from '../page'

const PLATFORM_FEE_PCT = 18

interface Props {
  draft: BookingDraft
  onNext: () => void
  onBack: () => void
}

export default function StepPriceEstimate({ draft, onNext, onBack }: Props) {
  const base = draft.basePrice ?? 0
  const platformFee = Math.round(base * (PLATFORM_FEE_PCT / 100))
  const total = base + platformFee

  return (
    <div>
      <h2 className="text-xl font-bold mb-1">Price estimate</h2>
      <p className="text-gray-500 text-sm mb-6">Final price may vary based on actual work required</p>

      <div className="bg-gray-50 rounded-xl p-5 space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{draft.serviceName} — base rate</span>
          <span className="font-medium">R{base.toFixed(0)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Platform fee ({PLATFORM_FEE_PCT}%)</span>
          <span className="font-medium">R{platformFee.toFixed(0)}</span>
        </div>
        <div className="border-t border-gray-200 pt-3 flex justify-between">
          <span className="font-semibold">Estimated total</span>
          <span className="font-bold text-blue-600 text-lg">R{total.toFixed(0)}</span>
        </div>
      </div>

      {draft.isEmergency && (
        <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-sm text-red-700 mb-4">
          🚨 Emergency surcharge may apply
        </div>
      )}

      <p className="text-xs text-gray-400 mb-6">
        Payment is processed after the job is completed and you approve the final price.
        You accept accepted cards and mobile money.
      </p>

      <div className="flex gap-2">
        <Button variant="outline" onClick={onBack} className="flex-1">Back</Button>
        <Button onClick={onNext} className="flex-1">Looks good →</Button>
      </div>
    </div>
  )
}
