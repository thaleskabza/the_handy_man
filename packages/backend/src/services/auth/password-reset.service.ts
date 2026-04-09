/**
 * Password Reset Service
 */

import { supabase } from '../../lib/supabase/client'
import { hashPassword } from './password.service'
import { generateVerificationToken } from './token.service'
import { sendPasswordResetEmail } from '../../lib/email/resend.client'

const RESET_TOKEN_EXPIRY_MS = 15 * 60 * 1000 // 15 minutes

interface ServiceResult {
  success: boolean
  error?: string
  code?: string
}

export async function forgotPassword(email: string): Promise<ServiceResult> {
  const { data: user } = await supabase
    .from('users')
    .select('id, first_name, password_hash')
    .eq('email', email.toLowerCase())
    .maybeSingle()

  if (!user || !user.password_hash) {
    return { success: true }
  }

  const token = generateVerificationToken()

  await supabase
    .from('users')
    .update({
      password_reset_token: token,
      password_reset_expiry: new Date(Date.now() + RESET_TOKEN_EXPIRY_MS).toISOString(),
    })
    .eq('id', user.id)

  const webUrl = process.env.WEB_URL || 'http://localhost:3001'
  const resetUrl = `${webUrl}/auth/reset-password?token=${token}`

  await sendPasswordResetEmail({ to: email, firstName: user.first_name, resetUrl })

  return { success: true }
}

export async function resetPassword(token: string, newPassword: string): Promise<ServiceResult> {
  const { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('password_reset_token', token)
    .gt('password_reset_expiry', new Date().toISOString())
    .maybeSingle()

  if (!user) {
    return { success: false, error: 'Invalid or expired reset token', code: 'INVALID_TOKEN' }
  }

  const passwordHash = await hashPassword(newPassword)

  await supabase
    .from('users')
    .update({
      password_hash: passwordHash,
      password_reset_token: null,
      password_reset_expiry: null,
    })
    .eq('id', user.id)

  await supabase.from('refresh_tokens').delete().eq('user_id', user.id)

  return { success: true }
}
