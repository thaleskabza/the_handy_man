/**
 * Password Reset Service
 * Handles forgot/reset password flow via Redis-cached tokens
 */

import { prisma } from '../../lib/prisma/client'
import { getRedisClient } from '../../lib/redis/client'
import { hashPassword } from './password.service'
import { generateVerificationToken } from './token.service'
import { sendPasswordResetEmail } from '../../lib/email/resend.client'

const RESET_TOKEN_EXPIRY = 15 * 60 // 15 minutes in seconds

interface ServiceResult {
  success: boolean
  error?: string
  code?: string
}

export async function forgotPassword(email: string): Promise<ServiceResult> {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  })

  // Always return success to prevent email enumeration
  if (!user || !user.passwordHash) {
    return { success: true }
  }

  const token = generateVerificationToken()
  const redis = getRedisClient()

  // Store token → userId mapping
  await redis.setex(`pwd_reset:${token}`, RESET_TOKEN_EXPIRY, user.id)

  const webUrl = process.env.WEB_URL || 'http://localhost:3001'
  const resetUrl = `${webUrl}/auth/reset-password?token=${token}`

  await sendPasswordResetEmail({
    to: email,
    firstName: user.firstName,
    resetUrl,
  })

  return { success: true }
}

export async function resetPassword(token: string, newPassword: string): Promise<ServiceResult> {
  const redis = getRedisClient()
  const userId = await redis.get(`pwd_reset:${token}`)

  if (!userId) {
    return { success: false, error: 'Invalid or expired reset token', code: 'INVALID_TOKEN' }
  }

  const passwordHash = await hashPassword(newPassword)

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    }),
    // Invalidate all existing refresh tokens on password change
    prisma.refreshToken.deleteMany({ where: { userId } }),
  ])

  await redis.del(`pwd_reset:${token}`)

  return { success: true }
}
