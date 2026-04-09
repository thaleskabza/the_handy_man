/**
 * Login Service
 */

import { supabase } from '../../lib/supabase/client'
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

  const { data: user, error } = await supabase
    .from('users')
    .select('id, email, phone, password_hash, role, is_email_verified, is_phone_verified')
    .eq(email ? 'email' : 'phone', email ? email.toLowerCase() : phone!.replace(/\s/g, ''))
    .maybeSingle()

  if (error || !user) {
    return { success: false, error: 'Invalid credentials', code: 'INVALID_CREDENTIALS' }
  }

  if (!user.password_hash) {
    return {
      success: false,
      error: 'This account uses social login. Please sign in with Google or Facebook.',
      code: 'NO_PASSWORD',
    }
  }

  const passwordValid = await verifyPassword(password, user.password_hash)
  if (!passwordValid) {
    return { success: false, error: 'Invalid credentials', code: 'INVALID_CREDENTIALS' }
  }

  if (email && !user.is_email_verified) {
    return {
      success: false,
      error: 'Please verify your email address before logging in.',
      code: 'EMAIL_NOT_VERIFIED',
    }
  }

  if (phone && !user.is_phone_verified) {
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

  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS)

  await supabase.from('refresh_tokens').insert({
    user_id: user.id,
    token: refreshTokenValue,
    expires_at: expiresAt.toISOString(),
  })

  return { success: true, accessToken, refreshToken: refreshTokenValue }
}

export async function refreshSession(token: string): Promise<LoginResult> {
  const { data: stored, error } = await supabase
    .from('refresh_tokens')
    .select('id, user_id, expires_at, users(id, email, phone, role)')
    .eq('token', token)
    .maybeSingle()

  if (error || !stored || new Date(stored.expires_at) < new Date()) {
    return { success: false, error: 'Invalid or expired refresh token', code: 'INVALID_TOKEN' }
  }

  const user = (Array.isArray(stored.users) ? stored.users[0] : stored.users) as { id: string; email: string | null; phone: string | null; role: string }

  const accessToken = await generateAccessToken({
    userId: user.id,
    email: user.email ?? undefined,
    phone: user.phone ?? undefined,
  })

  const newRefreshToken = await generateRefreshToken({
    userId: user.id,
    email: user.email ?? undefined,
    phone: user.phone ?? undefined,
  })

  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS)

  await supabase.from('refresh_tokens').delete().eq('id', stored.id)
  await supabase.from('refresh_tokens').insert({
    user_id: user.id,
    token: newRefreshToken,
    expires_at: expiresAt.toISOString(),
  })

  return { success: true, accessToken, refreshToken: newRefreshToken }
}

export async function logout(token: string): Promise<{ success: boolean }> {
  await supabase.from('refresh_tokens').delete().eq('token', token)
  return { success: true }
}
