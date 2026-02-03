/**
 * Authentication Types
 * Shared type definitions for auth across frontend and backend
 */

export type RegistrationMethod = 'EMAIL_PASSWORD' | 'PHONE' | 'GOOGLE' | 'FACEBOOK'

export interface User {
  id: string
  email: string | null
  phone: string | null
  firstName: string
  lastName: string
  registrationMethod: RegistrationMethod
  isEmailVerified: boolean
  isPhoneVerified: boolean
  createdAt: Date
  updatedAt: Date
}

export interface SignupEmailRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  acceptedTerms: boolean
  acceptedPrivacy: boolean
  marketingOptIn?: boolean
}

export interface SignupEmailResponse {
  success: boolean
  message: string
  userId?: string
}

export interface SignupPhoneRequest {
  phone: string
  firstName: string
  lastName: string
  acceptedTerms: boolean
  acceptedPrivacy: boolean
  marketingOptIn?: boolean
}

export interface SignupPhoneResponse {
  success: boolean
  message: string
  userId?: string
}

export interface VerifyEmailRequest {
  token: string
}

export interface VerifySmsRequest {
  phone: string
  code: string
}

export interface VerificationResponse {
  success: boolean
  message: string
  accessToken?: string
  refreshToken?: string
}

export interface ApiError {
  success: false
  error: string
  code?: string
  details?: Record<string, string[]>
}

export interface ApiSuccess<T> {
  success: true
  data: T
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError
