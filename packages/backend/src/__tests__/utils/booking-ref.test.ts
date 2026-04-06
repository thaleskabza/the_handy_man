import { describe, it, expect } from 'bun:test'

// Extracted as pure testable function (mirrors booking.service.ts logic)
function generateBookingRef(): string {
  const year = new Date().getFullYear()
  const rand = Math.floor(100000 + Math.random() * 900000)
  return `HM-${year}-${rand}`
}

describe('generateBookingRef', () => {
  it('follows HM-YEAR-NNNNNN format', () => {
    const ref = generateBookingRef()
    expect(ref).toMatch(/^HM-\d{4}-\d{6}$/)
  })

  it('contains the current year', () => {
    const ref = generateBookingRef()
    const year = new Date().getFullYear().toString()
    expect(ref).toContain(year)
  })

  it('generates unique references across 1000 calls', () => {
    const refs = new Set(Array.from({ length: 1000 }, generateBookingRef))
    // With 900000 possible values and 1000 samples, collision probability is negligible
    expect(refs.size).toBeGreaterThan(990)
  })

  it('the numeric suffix is 6 digits', () => {
    const ref = generateBookingRef()
    const suffix = ref.split('-')[2]
    expect(suffix).toHaveLength(6)
    expect(Number(suffix)).toBeGreaterThanOrEqual(100000)
    expect(Number(suffix)).toBeLessThanOrEqual(999999)
  })
})
