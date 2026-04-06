/**
 * Resend Verification Service
 * Resends email/SMS verification for unverified accounts
 */

import { prisma } from '../../lib/prisma/client'
import { getRedisClient } from '../../lib/redis/client'
import { generateVerificationToken, generateVerificationCode } from './token.service'
import { sendVerificationEmail } from '../../lib/email/resend.client'
import { sendVerificationSms } from '../../lib/sms/twilio.client'

const VERIFICATION_CODE_EXPIRY = 10 * 60 // 10 minutes

interface ServiceResult {
  success: boolean
  error?: string
  code?: string
}

export async function resendEmailVerification(email: string): Promise<ServiceResult> {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  })

  // Silently succeed to prevent enumeration
  if (!user) return { success: true }

  if (user.isEmailVerified) {
    return { success: false, error: 'Email is already verified', code: 'ALREADY_VERIFIED' }
  }

  const verificationToken = generateVerificationToken()

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerificationToken: verificationToken,
      emailVerificationExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  })

  const webUrl = process.env.WEB_URL || 'http://localhost:3001'
  const verificationUrl = `${webUrl}/auth/verify-email?token=${verificationToken}`

  await sendVerificationEmail({ to: email, firstName: user.firstName, verificationUrl })

  return { success: true }
}

export async function resendSmsVerification(phone: string): Promise<ServiceResult> {
  const normalizedPhone = phone.replace(/\s/g, '')

  const user = await prisma.user.findUnique({
    where: { phone: normalizedPhone },
  })

  if (!user) return { success: true }

  if (user.isPhoneVerified) {
    return { success: false, error: 'Phone is already verified', code: 'ALREADY_VERIFIED' }
  }

  const code = generateVerificationCode()
  const redis = getRedisClient()
  await redis.setex(`phone_verify:${normalizedPhone}`, VERIFICATION_CODE_EXPIRY, code)

  await sendVerificationSms({ to: normalizedPhone, code })

  return { success: true }
}
