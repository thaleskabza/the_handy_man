import { describe, it, expect } from 'bun:test'
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  generateVerificationToken,
  generateVerificationCode,
} from '../../services/auth/token.service'

const TEST_PAYLOAD = { userId: 'user-123', email: 'test@example.com' }

describe('token.service', () => {
  describe('generateAccessToken', () => {
    it('returns a JWT string with 3 parts', async () => {
      const token = await generateAccessToken(TEST_PAYLOAD)
      expect(token).toBeString()
      expect(token.split('.')).toHaveLength(3)
    })

    it('encodes the userId in the payload', async () => {
      const token = await generateAccessToken(TEST_PAYLOAD)
      const verified = await verifyToken(token)
      expect(verified?.userId).toBe('user-123')
    })

    it('encodes the email in the payload', async () => {
      const token = await generateAccessToken(TEST_PAYLOAD)
      const verified = await verifyToken(token)
      expect(verified?.email).toBe('test@example.com')
    })
  })

  describe('generateRefreshToken', () => {
    it('returns a JWT string', async () => {
      const token = await generateRefreshToken(TEST_PAYLOAD)
      expect(token).toBeString()
      expect(token.split('.')).toHaveLength(3)
    })

    it('is different from an access token for the same payload', async () => {
      const [access, refresh] = await Promise.all([
        generateAccessToken(TEST_PAYLOAD),
        generateRefreshToken(TEST_PAYLOAD),
      ])
      // Same payload but different exp — tokens should differ
      expect(access).not.toBe(refresh)
    })
  })

  describe('verifyToken', () => {
    it('returns payload for a valid access token', async () => {
      const token = await generateAccessToken(TEST_PAYLOAD)
      const payload = await verifyToken(token)
      expect(payload).not.toBeNull()
      expect(payload?.userId).toBe('user-123')
    })

    it('returns null for a tampered token', async () => {
      const token = await generateAccessToken(TEST_PAYLOAD)
      const tampered = token.slice(0, -5) + 'XXXXX'
      const result = await verifyToken(tampered)
      expect(result).toBeNull()
    })

    it('returns null for a random string', async () => {
      const result = await verifyToken('not.a.jwt')
      expect(result).toBeNull()
    })

    it('works for phone-only payloads', async () => {
      const token = await generateAccessToken({ userId: 'user-456', phone: '+27821234567' })
      const payload = await verifyToken(token)
      expect(payload?.phone).toBe('+27821234567')
      expect(payload?.email).toBeUndefined()
    })
  })

  describe('generateVerificationToken', () => {
    it('returns a 64-char hex string', () => {
      const token = generateVerificationToken()
      expect(token).toBeString()
      expect(token).toHaveLength(64)
      expect(token).toMatch(/^[a-f0-9]+$/)
    })

    it('generates unique tokens on each call', () => {
      const tokens = Array.from({ length: 5 }, generateVerificationToken)
      const unique = new Set(tokens)
      expect(unique.size).toBe(5)
    })
  })

  describe('generateVerificationCode', () => {
    it('returns a 6-digit string', () => {
      const code = generateVerificationCode()
      expect(code).toBeString()
      expect(code).toHaveLength(6)
      expect(code).toMatch(/^\d{6}$/)
    })

    it('is between 100000 and 999999', () => {
      const code = Number(generateVerificationCode())
      expect(code).toBeGreaterThanOrEqual(100000)
      expect(code).toBeLessThanOrEqual(999999)
    })
  })
})
