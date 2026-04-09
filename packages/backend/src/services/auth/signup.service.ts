/**
 * Signup Service
 */

import { supabase } from '../../lib/supabase/client'
import { hashPassword } from './password.service'
import { generateVerificationToken, generateVerificationCode } from './token.service'
import { sendVerificationEmail } from '../../lib/email/resend.client'
import { sendVerificationSms } from '../../lib/sms/twilio.client'
import type { SignupEmailInput, SignupPhoneInput } from '@handy-man/shared/validators'

const VERIFICATION_CODE_EXPIRY_MS = 10 * 60 * 1000 // 10 minutes

interface SignupResult {
  success: boolean
  userId?: string
  error?: string
  code?: string
}

export async function signupWithEmail(input: SignupEmailInput): Promise<SignupResult> {
  const { email, password, firstName, lastName, marketingOptIn } = input

  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('email', email.toLowerCase())
    .maybeSingle()

  if (existing) {
    return { success: false, error: 'Email already registered', code: 'EMAIL_EXISTS' }
  }

  const passwordHash = await hashPassword(password)
  const verificationToken = generateVerificationToken()

  const { data: user, error } = await supabase
    .from('users')
    .insert({
      email: email.toLowerCase(),
      password_hash: passwordHash,
      first_name: firstName,
      last_name: lastName,
      registration_method: 'EMAIL_PASSWORD',
      accepted_terms_at: new Date().toISOString(),
      accepted_privacy_at: new Date().toISOString(),
      marketing_opt_in: marketingOptIn ?? false,
      email_verification_token: verificationToken,
      email_verification_expiry: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    })
    .select('id')
    .single()

  if (error || !user) {
    return { success: false, error: 'Failed to create user', code: 'SERVER_ERROR' }
  }

  // Auto-create client profile
  await supabase.from('clients').insert({ user_id: user.id })

  const webUrl = process.env.WEB_URL || 'http://localhost:3001'
  const verificationUrl = `${webUrl}/auth/verify-email?token=${verificationToken}`

  await sendVerificationEmail({ to: email, firstName, verificationUrl })

  return { success: true, userId: user.id }
}

export async function signupWithPhone(input: SignupPhoneInput): Promise<SignupResult> {
  const { phone, firstName, lastName, marketingOptIn } = input
  const normalizedPhone = phone.replace(/\s/g, '')

  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('phone', normalizedPhone)
    .maybeSingle()

  if (existing) {
    return { success: false, error: 'Phone number already registered', code: 'PHONE_EXISTS' }
  }

  const verificationCode = generateVerificationCode()

  const { data: user, error } = await supabase
    .from('users')
    .insert({
      phone: normalizedPhone,
      first_name: firstName,
      last_name: lastName,
      registration_method: 'PHONE',
      accepted_terms_at: new Date().toISOString(),
      accepted_privacy_at: new Date().toISOString(),
      marketing_opt_in: marketingOptIn ?? false,
      phone_verification_code: verificationCode,
      phone_verification_expiry: new Date(Date.now() + VERIFICATION_CODE_EXPIRY_MS).toISOString(),
    })
    .select('id')
    .single()

  if (error || !user) {
    return { success: false, error: 'Failed to create user', code: 'SERVER_ERROR' }
  }

  await sendVerificationSms({ to: normalizedPhone, code: verificationCode })

  return { success: true, userId: user.id }
}
