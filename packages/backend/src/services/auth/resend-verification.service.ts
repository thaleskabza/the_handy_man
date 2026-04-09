/**
 * Resend Verification Service
 */

import { supabase } from '../../lib/supabase/client'
import { generateVerificationToken, generateVerificationCode } from './token.service'
import { sendVerificationEmail } from '../../lib/email/resend.client'
import { sendVerificationSms } from '../../lib/sms/twilio.client'

const VERIFICATION_CODE_EXPIRY_MS = 10 * 60 * 1000 // 10 minutes

interface ServiceResult {
  success: boolean
  error?: string
  code?: string
}

export async function resendEmailVerification(email: string): Promise<ServiceResult> {
  const { data: user } = await supabase
    .from('users')
    .select('id, first_name, is_email_verified')
    .eq('email', email.toLowerCase())
    .maybeSingle()

  if (!user) return { success: true }

  if (user.is_email_verified) {
    return { success: false, error: 'Email is already verified', code: 'ALREADY_VERIFIED' }
  }

  const verificationToken = generateVerificationToken()

  await supabase
    .from('users')
    .update({
      email_verification_token: verificationToken,
      email_verification_expiry: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    })
    .eq('id', user.id)

  const webUrl = process.env.WEB_URL || 'http://localhost:3001'
  const verificationUrl = `${webUrl}/auth/verify-email?token=${verificationToken}`

  await sendVerificationEmail({ to: email, firstName: user.first_name, verificationUrl })

  return { success: true }
}

export async function resendSmsVerification(phone: string): Promise<ServiceResult> {
  const normalizedPhone = phone.replace(/\s/g, '')

  const { data: user } = await supabase
    .from('users')
    .select('id, is_phone_verified')
    .eq('phone', normalizedPhone)
    .maybeSingle()

  if (!user) return { success: true }

  if (user.is_phone_verified) {
    return { success: false, error: 'Phone is already verified', code: 'ALREADY_VERIFIED' }
  }

  const code = generateVerificationCode()

  await supabase
    .from('users')
    .update({
      phone_verification_code: code,
      phone_verification_expiry: new Date(Date.now() + VERIFICATION_CODE_EXPIRY_MS).toISOString(),
    })
    .eq('id', user.id)

  await sendVerificationSms({ to: normalizedPhone, code })

  return { success: true }
}
