'use client'

import { useEffect, useState } from 'react'
import { apiFetch } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { BookingDraft } from '../page'

interface Address {
  id: string
  label: string
  addressLine1: string
  city: string
  isDefault: boolean
}

interface Props {
  draft: BookingDraft
  update: (p: Partial<BookingDraft>) => void
  onNext: () => void
  onBack: () => void
}

export default function StepAddress({ draft, update, onNext, onBack }: Props) {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [showNew, setShowNew] = useState(false)
  const [newAddr, setNewAddr] = useState({ label: 'Home', addressLine1: '', city: '', province: '', postalCode: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    apiFetch('/bookings/addresses')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setAddresses(d.addresses)
          if (d.addresses.length === 0) setShowNew(true)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const select = (addr: Address) => {
    update({ addressId: addr.id, addressLabel: addr.label, addressLine: `${addr.addressLine1}, ${addr.city}` })
    onNext()
  }

  const saveNew = async () => {
    if (!newAddr.addressLine1 || !newAddr.city || !newAddr.province || !newAddr.postalCode) {
      setError('Please fill in all required fields')
      return
    }
    setSaving(true)
    setError('')
    const res = await apiFetch('/bookings/addresses', {
      method: 'POST',
      body: JSON.stringify({ ...newAddr, isDefault: addresses.length === 0 }),
    })
    const data = await res.json()
    if (data.success) {
      const a = data.address
      setAddresses((prev) => [...prev, a])
      select(a)
    } else {
      setError(data.error || 'Failed to save address')
    }
    setSaving(false)
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-1">Where do you need the service?</h2>
      <p className="text-gray-500 text-sm mb-5">Select a saved address or add a new one</p>

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => <div key={i} className="h-16 rounded-lg bg-gray-100 animate-pulse" />)}
        </div>
      ) : (
        <>
          {addresses.length > 0 && !showNew && (
            <div className="space-y-2 mb-4">
              {addresses.map((addr) => (
                <button
                  key={addr.id}
                  onClick={() => select(addr)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    draft.addressId === addr.id ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-blue-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-sm">{addr.label}</span>
                      {addr.isDefault && <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">Default</span>}
                      <p className="text-xs text-gray-500 mt-0.5">{addr.addressLine1}, {addr.city}</p>
                    </div>
                    <span className="text-blue-500 text-sm">→</span>
                  </div>
                </button>
              ))}
              <button onClick={() => setShowNew(true)} className="w-full text-sm text-blue-600 hover:underline py-2">
                + Add new address
              </button>
            </div>
          )}

          {showNew && (
            <div className="space-y-3">
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div>
                <label className="block text-xs font-medium mb-1">Label</label>
                <select
                  value={newAddr.label}
                  onChange={(e) => setNewAddr((p) => ({ ...p, label: e.target.value }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                >
                  <option>Home</option><option>Office</option><option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Street Address *</label>
                <Input value={newAddr.addressLine1} onChange={(e) => setNewAddr((p) => ({ ...p, addressLine1: e.target.value }))} placeholder="12 Main Street" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium mb-1">City *</label>
                  <Input value={newAddr.city} onChange={(e) => setNewAddr((p) => ({ ...p, city: e.target.value }))} placeholder="Johannesburg" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Province *</label>
                  <Input value={newAddr.province} onChange={(e) => setNewAddr((p) => ({ ...p, province: e.target.value }))} placeholder="Gauteng" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Postal Code *</label>
                <Input value={newAddr.postalCode} onChange={(e) => setNewAddr((p) => ({ ...p, postalCode: e.target.value }))} placeholder="2000" />
              </div>
              <div className="flex gap-2 pt-2">
                {addresses.length > 0 && (
                  <Button variant="outline" onClick={() => setShowNew(false)} className="flex-1">Back</Button>
                )}
                <Button onClick={saveNew} disabled={saving} className="flex-1">
                  {saving ? 'Saving...' : 'Save & Continue'}
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      <button onClick={onBack} className="mt-4 text-sm text-gray-400 hover:text-gray-600">← Back</button>
    </div>
  )
}
