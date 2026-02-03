/**
 * Verification Service
 * Handles email and phone verification
 */

import { prisma } from '../../lib/prisma/client'
import { getRedisClient } from '../../lib/redis/client'
import { generateAccessToken, generateRefreshToken } from './token.service'

interface VerificationResult {
  success: boolean
  accessToken?: string
  refreshToken?: string
  error?: string
  code?: string
}

export async function verifyEmail(token: string): Promise<VerificationResult> {
  // Find user with this verification token
  const user = await prisma.user.findFirst({
    where: {
      emailVerificationToken: token,
      emailVerificationExpiry: { gt: new Date() },
    },
  })

  if (!user) {
    return { success: false, error: 'Invalid or expired token', code: 'INVALID_TOKEN' }
  }

  // Mark email as verified
  await prisma.user.update({
    where: { id: user.id },
    data: {
      isEmailVerified: true,
      emailVerifiedAt: new Date(),
      emailVerificationToken: null,
      emailVerificationExpiry: null,
    },
  })

  // Generate tokens
  const accessToken = await generateAccessToken({
    userId: user.id,
    email: user.email!,
  })

  const refreshToken = await generateRefreshToken({
    userId: user.id,
    email: user.email!,
  })

  return { success: true, accessToken, refreshToken }
}

export async function verifySms(phone: string, code: string): Promise<VerificationResult> {
  const normalizedPhone = phone.replace(/\s/g, '')
  const redis = getRedisClient()

  // Get stored code from Redis
  const storedCode = await redis.get(`phone_verify:${normalizedPhone}`)

  if (!storedCode) {
    return { success: false, error: 'Code expired', code: 'CODE_EXPIRED' }
  }

  if (storedCode !== code) {
    return { success: false, error: 'Invalid code', code: 'INVALID_CODE' }
  }

  // Find user
  const user = await prisma.user.findUnique({
    where: { phone: normalizedPhone },
  })

  if (!user) {
    return { success: false, error: 'User not found', code: 'USER_NOT_FOUND' }
  }

  // Mark phone as verified
  await prisma.user.update({
    where: { id: user.id },
    data: {
      isPhoneVerified: true,
      phoneVerifiedAt: new Date(),
    },
  })

  // Delete used code
  await redis.del(`phone_verify:${normalizedPhone}`)

  // Generate tokens
  const accessToken = await generateAccessToken({
    userId: user.id,
    phone: user.phone!,
  })

  const refreshToken = await generateRefreshToken({
    userId: user.id,
    phone: user.phone!,
  })

  return { success: true, accessToken, refreshToken }
}
