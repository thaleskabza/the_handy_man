/**
 * Authentication Constants
 */

export const AUTH_ERRORS = {
  EMAIL_EXISTS: 'EMAIL_EXISTS',
  PHONE_EXISTS: 'PHONE_EXISTS',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',
  PHONE_NOT_VERIFIED: 'PHONE_NOT_VERIFIED',
  INVALID_TOKEN: 'INVALID_TOKEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  INVALID_CODE: 'INVALID_CODE',
  CODE_EXPIRED: 'CODE_EXPIRED',
  RATE_LIMITED: 'RATE_LIMITED',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
} as const

export type AuthError = (typeof AUTH_ERRORS)[keyof typeof AUTH_ERRORS]

export const AUTH_MESSAGES = {
  [AUTH_ERRORS.EMAIL_EXISTS]: 'An account with this email already exists',
  [AUTH_ERRORS.PHONE_EXISTS]: 'An account with this phone number already exists',
  [AUTH_ERRORS.INVALID_CREDENTIALS]: 'Invalid email or password',
  [AUTH_ERRORS.USER_NOT_FOUND]: 'User not found',
  [AUTH_ERRORS.EMAIL_NOT_VERIFIED]: 'Please verify your email address',
  [AUTH_ERRORS.PHONE_NOT_VERIFIED]: 'Please verify your phone number',
  [AUTH_ERRORS.INVALID_TOKEN]: 'Invalid verification token',
  [AUTH_ERRORS.TOKEN_EXPIRED]: 'Verification token has expired',
  [AUTH_ERRORS.INVALID_CODE]: 'Invalid verification code',
  [AUTH_ERRORS.CODE_EXPIRED]: 'Verification code has expired',
  [AUTH_ERRORS.RATE_LIMITED]: 'Too many attempts. Please try again later',
  [AUTH_ERRORS.VALIDATION_ERROR]: 'Validation error',
} as const

export const VERIFICATION_CODE_LENGTH = 6
export const VERIFICATION_CODE_EXPIRY_MINUTES = 10
export const EMAIL_TOKEN_EXPIRY_HOURS = 24
