/**
 * Verification Service
 */

import { supabase } from '../../lib/supabase/client'
import { generateAccessToken, generateRefreshToken } from './token.service'

interface VerificationResult {
  success: boolean
  accessToken?: string
  refreshToken?: string
  error?: string
  code?: string
}

export async function verifyEmail(token: string): Promise<VerificationResult> {
  const { data: user } = await supabase
    .from('users')
    .select('id, email, phone, email_verification_expiry')
    .eq('email_verification_token', token)
    .maybeSingle()

  if (!user || new Date(user.email_verification_expiry) < new Date()) {
    return { success: false, error: 'Invalid or expired token', code: 'INVALID_TOKEN' }
  }

  await supabase
    .from('users')
    .update({
      is_email_verified: true,
      email_verified_at: new Date().toISOString(),
      email_verification_token: null,
      email_verification_expiry: null,
    })
    .eq('id', user.id)

  const accessToken = await generateAccessToken({ userId: user.id, email: user.email })
  const refreshToken = await generateRefreshToken({ userId: user.id, email: user.email })

  return { success: true, accessToken, refreshToken }
}

export async function verifySms(phone: string, code: string): Promise<VerificationResult> {
  const normalizedPhone = phone.replace(/\s/g, '')

  const { data: user } = await supabase
    .from('users')
    .select('id, phone, phone_verification_code, phone_verification_expiry')
    .eq('phone', normalizedPhone)
    .maybeSingle()

  if (!user || !user.phone_verification_code || !user.phone_verification_expiry) {
    return { success: false, error: 'Code expired', code: 'CODE_EXPIRED' }
  }

  if (new Date(user.phone_verification_expiry) < new Date()) {
    return { success: false, error: 'Code expired', code: 'CODE_EXPIRED' }
  }

  if (user.phone_verification_code !== code) {
    return { success: false, error: 'Invalid code', code: 'INVALID_CODE' }
  }

  await supabase
    .from('users')
    .update({
      is_phone_verified: true,
      phone_verified_at: new Date().toISOString(),
      phone_verification_code: null,
      phone_verification_expiry: null,
    })
    .eq('id', user.id)

  const accessToken = await generateAccessToken({ userId: user.id, phone: user.phone })
  const refreshToken = await generateRefreshToken({ userId: user.id, phone: user.phone })

  return { success: true, accessToken, refreshToken }
}
