import { APIRequestContext, APIResponse } from '@playwright/test'
import { BaseAgent } from './base.agent'

/**
 * Service Categories API Agent
 * Encapsulates all service-category API calls — no assertions.
 */
export class ServiceCategoriesAgent extends BaseAgent {
  constructor(request: APIRequestContext) {
    super(request)
  }

  async getAll(): Promise<APIResponse> {
    return this.request.get(this.endpoints.serviceCategories)
  }

  async getBySlug(slug: string): Promise<APIResponse> {
    return this.request.get(`${this.endpoints.serviceCategories}/${slug}`)
  }

  async create(
    payload: { name: string; slug: string; description?: string; basePrice: number },
    accessToken: string
  ): Promise<APIResponse> {
    return this.request.post(this.endpoints.serviceCategories, {
      data: payload,
      headers: { Authorization: `Bearer ${accessToken}` },
    })
  }
}
