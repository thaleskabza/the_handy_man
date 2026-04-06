'use client'

import { Button } from '@/components/ui/button'
import type { BookingDraft } from '../page'

interface Props {
  draft: BookingDraft
  onBack: () => void
  onSubmit: () => void
  isSubmitting: boolean
  error: string
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-right max-w-[60%]">{value}</span>
    </div>
  )
}

export default function StepConfirm({ draft, onBack, onSubmit, isSubmitting, error }: Props) {
  const base = draft.basePrice ?? 0
  const platformFee = Math.round(base * 0.18)
  const total = base + platformFee

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-ZA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div>
      <h2 className="text-xl font-bold mb-1">Review & confirm</h2>
      <p className="text-gray-500 text-sm mb-5">Make sure everything looks right</p>

      <div className="bg-gray-50 rounded-xl p-4 mb-5">
        <Row label="Service" value={draft.serviceName} />
        <Row label="Address" value={`${draft.addressLabel} — ${draft.addressLine}`} />
        <Row label="Date" value={draft.scheduledDate ? formatDate(draft.scheduledDate) : '—'} />
        <Row label="Time" value={draft.scheduledTimeStart || '—'} />
        {draft.professionalName && <Row label="Professional" value={draft.professionalName} />}
        {!draft.professionalName && <Row label="Professional" value="Best available" />}
        {draft.clientDescription && <Row label="Notes" value={draft.clientDescription} />}
        {draft.isEmergency && <Row label="Priority" value="🚨 Emergency" />}
        <Row label="Estimated total" value={`R${total.toFixed(0)}`} />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 text-sm rounded-lg p-3 mb-4">
          {error}
        </div>
      )}

      <p className="text-xs text-gray-400 mb-5">
        By confirming you agree to our Terms of Service. Payment is collected after service completion.
      </p>

      <div className="flex gap-2">
        <Button variant="outline" onClick={onBack} className="flex-1" disabled={isSubmitting}>
          Back
        </Button>
        <Button onClick={onSubmit} className="flex-1" disabled={isSubmitting}>
          {isSubmitting ? 'Confirming...' : 'Confirm Booking'}
        </Button>
      </div>
    </div>
  )
}
