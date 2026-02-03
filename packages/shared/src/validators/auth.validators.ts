/**
 * Authentication Validators
 * Zod schemas for validating auth requests
 */

import { z } from 'zod'

// Password requirements
const PASSWORD_MIN_LENGTH = 8
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/

export const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters`)
  .regex(
    PASSWORD_REGEX,
    'Password must contain uppercase, lowercase, number, and special character'
  )

export const emailSchema = z.string().email('Invalid email address')

export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')

export const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .max(50, 'Name must be less than 50 characters')
  .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes')

// Email signup schema
export const signupEmailSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: nameSchema,
  lastName: nameSchema,
  acceptedTerms: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the terms and conditions' }),
  }),
  acceptedPrivacy: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the privacy policy' }),
  }),
  marketingOptIn: z.boolean().optional().default(false),
})

// Phone signup schema
export const signupPhoneSchema = z.object({
  phone: phoneSchema,
  firstName: nameSchema,
  lastName: nameSchema,
  acceptedTerms: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the terms and conditions' }),
  }),
  acceptedPrivacy: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the privacy policy' }),
  }),
  marketingOptIn: z.boolean().optional().default(false),
})

// Email verification schema
export const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Verification token is required'),
})

// SMS verification schema
export const verifySmsSchema = z.object({
  phone: phoneSchema,
  code: z.string().length(6, 'Verification code must be 6 digits'),
})

// Resend verification schemas
export const resendEmailSchema = z.object({
  email: emailSchema,
})

export const resendSmsSchema = z.object({
  phone: phoneSchema,
})

// Type exports
export type SignupEmailInput = z.infer<typeof signupEmailSchema>
export type SignupPhoneInput = z.infer<typeof signupPhoneSchema>
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>
export type VerifySmsInput = z.infer<typeof verifySmsSchema>
export type ResendEmailInput = z.infer<typeof resendEmailSchema>
export type ResendSmsInput = z.infer<typeof resendSmsSchema>
