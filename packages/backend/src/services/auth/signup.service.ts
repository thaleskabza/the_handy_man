/**
 * Signup Service
 * Handles user registration logic
 */

import { prisma } from '../../lib/prisma/client'
import { hashPassword } from './password.service'
import { generateVerificationToken, generateVerificationCode } from './token.service'
import { sendVerificationEmail } from '../../lib/email/resend.client'
import { sendVerificationSms } from '../../lib/sms/twilio.client'
import { getRedisClient } from '../../lib/redis/client'
import type { SignupEmailInput, SignupPhoneInput } from '@handy-man/shared/validators'

const VERIFICATION_CODE_EXPIRY = 10 * 60 // 10 minutes in seconds

interface SignupResult {
  success: boolean
  userId?: string
  error?: string
  code?: string
}

export async function signupWithEmail(input: SignupEmailInput): Promise<SignupResult> {
  const { email, password, firstName, lastName, acceptedTerms, acceptedPrivacy, marketingOptIn } =
    input

  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  })

  if (existingUser) {
    return { success: false, error: 'Email already registered', code: 'EMAIL_EXISTS' }
  }

  // Hash password
  const passwordHash = await hashPassword(password)

  // Generate verification token
  const verificationToken = generateVerificationToken()

  // Create user
  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      passwordHash,
      firstName,
      lastName,
      registrationMethod: 'EMAIL_PASSWORD',
      acceptedTermsAt: new Date(),
      acceptedPrivacyAt: new Date(),
      marketingOptIn: marketingOptIn ?? false,
      emailVerificationToken: verificationToken,
      emailVerificationExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    },
  })

  // Send verification email
  const webUrl = process.env.WEB_URL || 'http://localhost:3001'
  const verificationUrl = `${webUrl}/auth/verify-email?token=${verificationToken}`

  await sendVerificationEmail({
    to: email,
    firstName,
    verificationUrl,
  })

  return { success: true, userId: user.id }
}

export async function signupWithPhone(input: SignupPhoneInput): Promise<SignupResult> {
  const { phone, firstName, lastName, acceptedTerms, acceptedPrivacy, marketingOptIn } = input

  // Normalize phone number (basic normalization)
  const normalizedPhone = phone.replace(/\s/g, '')

  // Check if phone already exists
  const existingUser = await prisma.user.findUnique({
    where: { phone: normalizedPhone },
  })

  if (existingUser) {
    return { success: false, error: 'Phone number already registered', code: 'PHONE_EXISTS' }
  }

  // Generate verification code
  const verificationCode = generateVerificationCode()

  // Create user
  const user = await prisma.user.create({
    data: {
      phone: normalizedPhone,
      firstName,
      lastName,
      registrationMethod: 'PHONE',
      acceptedTermsAt: new Date(),
      acceptedPrivacyAt: new Date(),
      marketingOptIn: marketingOptIn ?? false,
    },
  })

  // Store verification code in Redis
  const redis = getRedisClient()
  await redis.setex(`phone_verify:${normalizedPhone}`, VERIFICATION_CODE_EXPIRY, verificationCode)

  // Send SMS
  await sendVerificationSms({
    to: normalizedPhone,
    code: verificationCode,
  })

  return { success: true, userId: user.id }
}
