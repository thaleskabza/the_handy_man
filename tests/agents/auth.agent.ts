import { APIRequestContext, APIResponse } from '@playwright/test'
import { BaseAgent } from './base.agent'

export interface SignupEmailPayload {
  email: string
  password: string
  firstName: string
  lastName: string
  acceptedTerms: boolean
  acceptedPrivacy: boolean
  marketingOptIn?: boolean
}

export interface LoginPayload {
  email?: string
  phone?: string
  password: string
}

/**
 * Auth API Agent
 * Encapsulates all auth-related API calls — no assertions.
 */
export class AuthAgent extends BaseAgent {
  constructor(request: APIRequestContext) {
    super(request)
  }

  async signupEmail(payload: SignupEmailPayload): Promise<APIResponse> {
    return this.request.post(this.endpoints.auth.signupEmail, { data: payload })
  }

  async login(payload: LoginPayload): Promise<APIResponse> {
    return this.request.post(this.endpoints.auth.login, { data: payload })
  }

  async refresh(refreshToken: string): Promise<APIResponse> {
    return this.request.post(this.endpoints.auth.refresh, {
      data: { refreshToken },
    })
  }

  async logout(refreshToken: string): Promise<APIResponse> {
    return this.request.post(this.endpoints.auth.logout, {
      data: { refreshToken },
    })
  }

  async me(accessToken: string): Promise<APIResponse> {
    return this.request.get(this.endpoints.auth.me, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
  }

  async forgotPassword(email: string): Promise<APIResponse> {
    return this.request.post(this.endpoints.auth.forgotPassword, {
      data: { email },
    })
  }

  /** Test-only: bypasses email verification. Blocked in production. */
  async verifyForTest(email: string): Promise<APIResponse> {
    return this.request.post('/test/verify-user', { data: { email } })
  }
}
