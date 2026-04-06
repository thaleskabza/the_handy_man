import { APIRequestContext } from '@playwright/test'
import endpoints from '../configs/endpoints.json'

export type Endpoints = typeof endpoints

/**
 * Base API agent — encapsulates HTTP calls, zero assertions.
 * All agents extend this class.
 */
export class BaseAgent {
  protected readonly request: APIRequestContext
  protected readonly endpoints: Endpoints

  constructor(request: APIRequestContext) {
    this.request = request
    this.endpoints = endpoints
  }
}
