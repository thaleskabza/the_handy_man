import { APIRequestContext, APIResponse } from '@playwright/test'
import { BaseAgent } from './base.agent'

export interface CreateBookingPayload {
  serviceCategoryId: string
  addressId: string
  scheduledDate: string
  scheduledTimeStart: string
  clientDescription?: string
  isEmergency?: boolean
  professionalId?: string
}

/**
 * Bookings API Agent
 * Encapsulates all booking API calls — no assertions.
 */
export class BookingsAgent extends BaseAgent {
  constructor(request: APIRequestContext) {
    super(request)
  }

  async getAll(accessToken: string, filter: 'upcoming' | 'past' = 'upcoming'): Promise<APIResponse> {
    return this.request.get(`${this.endpoints.bookings.list}?filter=${filter}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
  }

  async getById(id: string, accessToken: string): Promise<APIResponse> {
    return this.request.get(`${this.endpoints.bookings.list}/${id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
  }

  async create(payload: CreateBookingPayload, accessToken: string): Promise<APIResponse> {
    return this.request.post(this.endpoints.bookings.create, {
      data: payload,
      headers: { Authorization: `Bearer ${accessToken}` },
    })
  }

  async cancel(id: string, reason: string, accessToken: string): Promise<APIResponse> {
    return this.request.post(`${this.endpoints.bookings.list}/${id}/cancel`, {
      data: { reason },
      headers: { Authorization: `Bearer ${accessToken}` },
    })
  }

  async getAddresses(accessToken: string): Promise<APIResponse> {
    return this.request.get(this.endpoints.bookings.addresses, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
  }

  async createAddress(
    payload: {
      label: string
      addressLine1: string
      city: string
      province: string
      postalCode: string
    },
    accessToken: string
  ): Promise<APIResponse> {
    return this.request.post(this.endpoints.bookings.addresses, {
      data: payload,
      headers: { Authorization: `Bearer ${accessToken}` },
    })
  }
}
