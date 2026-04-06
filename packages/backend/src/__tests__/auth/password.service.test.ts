import { describe, it, expect } from 'bun:test'
import { hashPassword, verifyPassword } from '../../services/auth/password.service'

describe('password.service', () => {
  describe('hashPassword', () => {
    it('returns a bcrypt hash string', async () => {
      const hash = await hashPassword('MyPassword123!')
      expect(hash).toBeString()
      expect(hash).toStartWith('$2')
    })

    it('produces different hashes for the same password', async () => {
      const [h1, h2] = await Promise.all([
        hashPassword('MyPassword123!'),
        hashPassword('MyPassword123!'),
      ])
      expect(h1).not.toBe(h2)
    })
  })

  describe('verifyPassword', () => {
    it('returns true for a correct password', async () => {
      const hash = await hashPassword('Secure@Pass1')
      const result = await verifyPassword('Secure@Pass1', hash)
      expect(result).toBe(true)
    })

    it('returns false for an incorrect password', async () => {
      const hash = await hashPassword('Secure@Pass1')
      const result = await verifyPassword('WrongPassword', hash)
      expect(result).toBe(false)
    })

    it('returns false for an empty string against a real hash', async () => {
      const hash = await hashPassword('Secure@Pass1')
      const result = await verifyPassword('', hash)
      expect(result).toBe(false)
    })
  })
})
