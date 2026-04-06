/**
 * Login Service
 * Handles user authentication and session management
 */

import { prisma } from '../../lib/prisma/client'
import { verifyPassword } from './password.service'
import { generateAccessToken, generateRefreshToken } from './token.service'
import type { LoginInput } from '@handy-man/shared/validators'

const REFRESH_TOKEN_EXPIRY_DAYS = 7

interface LoginResult {
  success: boolean
  accessToken?: string
  refreshToken?: string
  error?: string
  code?: string
}

export async function login(input: LoginInput): Promise<LoginResult> {
  const { email, phone, password } = input

  // Find user by email or phone
  const user = await prisma.user.findFirst({
    where: email
      ? { email: email.toLowerCase() }
      : { phone: phone!.replace(/\s/g, '') },
  })

  if (!user) {
    return { success: false, error: 'Invalid credentials', code: 'INVALID_CREDENTIALS' }
  }

  // Require password (social-only accounts cannot log in with password)
  if (!user.passwordHash) {
    return {
      success: false,
      error: 'This account uses social login. Please sign in with Google or Facebook.',
      code: 'NO_PASSWORD',
    }
  }

  const passwordValid = await verifyPassword(password, user.passwordHash)
  if (!passwordValid) {
    return { success: false, error: 'Invalid credentials', code: 'INVALID_CREDENTIALS' }
  }

  // Check email/phone verification
  if (email && !user.isEmailVerified) {
    return {
      success: false,
      error: 'Please verify your email address before logging in.',
      code: 'EMAIL_NOT_VERIFIED',
    }
  }

  if (phone && !user.isPhoneVerified) {
    return {
      success: false,
      error: 'Please verify your phone number before logging in.',
      code: 'PHONE_NOT_VERIFIED',
    }
  }

  const accessToken = await generateAccessToken({
    userId: user.id,
    email: user.email ?? undefined,
    phone: user.phone ?? undefined,
  })

  const refreshTokenValue = await generateRefreshToken({
    userId: user.id,
    email: user.email ?? undefined,
    phone: user.phone ?? undefined,
  })

  // Persist refresh token in DB
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS)

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: refreshTokenValue,
      expiresAt,
    },
  })

  return { success: true, accessToken, refreshToken: refreshTokenValue }
}

export async function refreshSession(token: string): Promise<LoginResult> {
  // Look up the stored token
  const stored = await prisma.refreshToken.findUnique({
    where: { token },
    include: { user: true },
  })

  if (!stored || stored.expiresAt < new Date()) {
    return { success: false, error: 'Invalid or expired refresh token', code: 'INVALID_TOKEN' }
  }

  const { user } = stored

  const accessToken = await generateAccessToken({
    userId: user.id,
    email: user.email ?? undefined,
    phone: user.phone ?? undefined,
  })

  // Rotate refresh token
  const newRefreshToken = await generateRefreshToken({
    userId: user.id,
    email: user.email ?? undefined,
    phone: user.phone ?? undefined,
  })

  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS)

  await prisma.$transaction([
    prisma.refreshToken.delete({ where: { id: stored.id } }),
    prisma.refreshToken.create({
      data: { userId: user.id, token: newRefreshToken, expiresAt },
    }),
  ])

  return { success: true, accessToken, refreshToken: newRefreshToken }
}

export async function logout(token: string): Promise<{ success: boolean }> {
  await prisma.refreshToken.deleteMany({ where: { token } })
  return { success: true }
}
