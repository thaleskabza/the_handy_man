import { describe, it, expect } from 'bun:test'
import {
  signupEmailSchema,
  loginSchema,
  createBookingSchema,
} from '@handy-man/shared/validators'

describe('signupEmailSchema', () => {
  const valid = {
    email: 'user@example.com',
    password: 'Secure@Pass1',
    firstName: 'John',
    lastName: 'Doe',
    acceptedTerms: true,
    acceptedPrivacy: true,
  }

  it('accepts valid signup input', () => {
    const result = signupEmailSchema.safeParse(valid)
    expect(result.success).toBe(true)
  })

  it('rejects missing email', () => {
    const result = signupEmailSchema.safeParse({ ...valid, email: '' })
    expect(result.success).toBe(false)
  })

  it('rejects weak password (too short)', () => {
    const result = signupEmailSchema.safeParse({ ...valid, password: 'abc' })
    expect(result.success).toBe(false)
  })

  it('rejects when acceptedTerms is false', () => {
    const result = signupEmailSchema.safeParse({ ...valid, acceptedTerms: false })
    expect(result.success).toBe(false)
  })
})

describe('loginSchema', () => {
  it('accepts login with email and password', () => {
    const result = loginSchema.safeParse({ email: 'user@example.com', password: 'pass' })
    expect(result.success).toBe(true)
  })

  it('accepts login with phone and password', () => {
    const result = loginSchema.safeParse({ phone: '+27821234567', password: 'pass' })
    expect(result.success).toBe(true)
  })

  it('rejects login with neither email nor phone', () => {
    const result = loginSchema.safeParse({ password: 'pass' })
    expect(result.success).toBe(false)
  })

  it('rejects login with no password', () => {
    const result = loginSchema.safeParse({ email: 'user@example.com' })
    expect(result.success).toBe(false)
  })
})

describe('createBookingSchema', () => {
  const valid = {
    serviceCategoryId: 'cat-123',
    addressId: 'addr-456',
    scheduledDate: '2026-06-01',
    scheduledTimeStart: '09:00',
  }

  it('accepts valid booking input', () => {
    const result = createBookingSchema.safeParse(valid)
    expect(result.success).toBe(true)
  })

  it('rejects missing serviceCategoryId', () => {
    const { serviceCategoryId: _, ...rest } = valid
    const result = createBookingSchema.safeParse(rest)
    expect(result.success).toBe(false)
  })

  it('rejects missing scheduledDate', () => {
    const { scheduledDate: _, ...rest } = valid
    const result = createBookingSchema.safeParse(rest)
    expect(result.success).toBe(false)
  })
})
