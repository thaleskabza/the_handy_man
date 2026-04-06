import { APIRequestContext, APIResponse } from '@playwright/test'
import { BaseAgent } from './base.agent'

/**
 * Health API Agent
 * Encapsulates all health-related API calls — no assertions.
 */
export class HealthAgent extends BaseAgent {
  constructor(request: APIRequestContext) {
    super(request)
  }

  async getHealth(): Promise<APIResponse> {
    return this.request.get(this.endpoints.health)
  }
}
