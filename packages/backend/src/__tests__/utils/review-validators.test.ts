import { describe, it, expect } from 'bun:test'
import { createReviewSchema, professionalResponseSchema } from '@handy-man/shared/validators'

describe('createReviewSchema', () => {
  const valid = {
    bookingId: 'booking-123',
    overallRating: 5,
  }

  it('accepts minimal valid input', () => {
    expect(createReviewSchema.safeParse(valid).success).toBe(true)
  })

  it('accepts full valid input', () => {
    const result = createReviewSchema.safeParse({
      ...valid,
      punctualityRating: 4,
      qualityRating: 5,
      professionalismRating: 5,
      valueRating: 3,
      reviewText: 'Great work!',
      wouldRecommend: true,
    })
    expect(result.success).toBe(true)
  })

  it('rejects missing bookingId', () => {
    const { bookingId: _, ...rest } = valid
    expect(createReviewSchema.safeParse(rest).success).toBe(false)
  })

  it('rejects overallRating of 0', () => {
    expect(createReviewSchema.safeParse({ ...valid, overallRating: 0 }).success).toBe(false)
  })

  it('rejects overallRating of 6', () => {
    expect(createReviewSchema.safeParse({ ...valid, overallRating: 6 }).success).toBe(false)
  })

  it('rejects reviewText longer than 500 chars', () => {
    expect(
      createReviewSchema.safeParse({ ...valid, reviewText: 'a'.repeat(501) }).success
    ).toBe(false)
  })

  it('defaults wouldRecommend to true', () => {
    const result = createReviewSchema.safeParse(valid)
    expect(result.success && result.data.wouldRecommend).toBe(true)
  })
})

describe('professionalResponseSchema', () => {
  it('accepts a valid response', () => {
    expect(professionalResponseSchema.safeParse({ response: 'Thank you!' }).success).toBe(true)
  })

  it('rejects empty response', () => {
    expect(professionalResponseSchema.safeParse({ response: '' }).success).toBe(false)
  })

  it('rejects response longer than 500 chars', () => {
    expect(
      professionalResponseSchema.safeParse({ response: 'x'.repeat(501) }).success
    ).toBe(false)
  })
})
