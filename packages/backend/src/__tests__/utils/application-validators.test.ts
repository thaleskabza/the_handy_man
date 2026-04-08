import { describe, it, expect } from 'bun:test'
import { submitApplicationSchema, reviewApplicationSchema } from '@handy-man/shared/validators'

describe('submitApplicationSchema', () => {
  const valid = {
    yearsExperience: 3,
    selectedCategories: ['cat-1', 'cat-2'],
    agreedToBackgroundCheck: true as const,
  }

  it('accepts minimal valid input', () => {
    expect(submitApplicationSchema.safeParse(valid).success).toBe(true)
  })

  it('accepts full valid input with optional fields', () => {
    const result = submitApplicationSchema.safeParse({
      ...valid,
      idDocumentUrl: 'https://storage.example.com/id.pdf',
      certificationsUrls: ['https://storage.example.com/cert.pdf'],
      referencesUrls: [],
    })
    expect(result.success).toBe(true)
  })

  it('rejects empty selectedCategories', () => {
    expect(submitApplicationSchema.safeParse({ ...valid, selectedCategories: [] }).success).toBe(false)
  })

  it('rejects agreedToBackgroundCheck = false', () => {
    expect(
      submitApplicationSchema.safeParse({ ...valid, agreedToBackgroundCheck: false }).success
    ).toBe(false)
  })

  it('rejects negative yearsExperience', () => {
    expect(submitApplicationSchema.safeParse({ ...valid, yearsExperience: -1 }).success).toBe(false)
  })

  it('rejects invalid URL in idDocumentUrl', () => {
    expect(
      submitApplicationSchema.safeParse({ ...valid, idDocumentUrl: 'not-a-url' }).success
    ).toBe(false)
  })
})

describe('reviewApplicationSchema', () => {
  it('accepts APPROVED status', () => {
    expect(reviewApplicationSchema.safeParse({ status: 'APPROVED' }).success).toBe(true)
  })

  it('accepts REJECTED status with reason', () => {
    const result = reviewApplicationSchema.safeParse({
      status: 'REJECTED',
      rejectionReason: 'Documents incomplete',
    })
    expect(result.success).toBe(true)
  })

  it('rejects unknown status', () => {
    expect(reviewApplicationSchema.safeParse({ status: 'PENDING' }).success).toBe(false)
  })

  it('rejects adminNotes longer than 1000 chars', () => {
    expect(
      reviewApplicationSchema.safeParse({ status: 'APPROVED', adminNotes: 'x'.repeat(1001) }).success
    ).toBe(false)
  })
})
