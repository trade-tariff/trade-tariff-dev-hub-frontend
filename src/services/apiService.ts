import { AuthTokenFetcher } from '../utils/authTokenFetcher'
import { logger } from '../config/logging'

const tokenFetcher = new AuthTokenFetcher(
  process.env.COGNITO_AUTH_URL ?? '',
  process.env.COGNITO_CLIENT_ID ?? '',
  process.env.COGNITO_CLIENT_SECRET ?? ''
)

export interface ApiKey {
  CustomerApiKeyId: string
  ApiGatewayId: string
  UsagePlanId: string
  Secret: string
  Enabled: boolean
  Description: string
  OrganisationId: string
  CreatedAt: string
  UpdatedAt: string
}

export namespace ApiService {
  export async function getKey (organisationId: string, customerKeyId: string): Promise<ApiKey> {
    try {
      return await doRequest(
        `/api/keys/${organisationId}/${customerKeyId}`,
        'GET'
      )
    } catch (error) {
      logger.error('Error fetching API key:', error)
      throw error
    }
  }

  export async function listKeys (organisationId: string): Promise<ApiKey[]> {
    try {
      return await doRequest(
        `/api/keys/${organisationId}`,
        'GET'
      )
    } catch (error) {
      logger.error('Error fetching API keys:', error)
      throw error
    }
  }

  export async function revokeAPIKey (organisationId: string, customerKeyId: string, enabled: boolean): Promise<any> {
    try {
      return await doRequest(
        `/api/keys/${organisationId}/${customerKeyId}`,
        'PATCH',
        JSON.stringify({ enabled })
      )
    } catch (error) {
      logger.error('Error updating API key:', error)
      throw error
    }
  }

  export async function deleteAPIKey (organisationId: string, customerKeyId: string): Promise<any> {
    try {
      return await doRequest(`/api/keys/${organisationId}/${customerKeyId}`, 'DELETE')
    } catch (error) {
      logger.error('Error deleting API key:', error)
      throw error
    }
  }

  export async function createAPIKey (organisationId: string, description: string): Promise<ApiKey> {
    try {
      return await doRequest(
        `/api/keys/${organisationId}`,
        'POST',
        JSON.stringify({ description })
      )
    } catch (error) {
      logger.error('Error creating API key:', error)
      throw error
    }
  }

  async function doRequest (path: string, method: 'GET' | 'POST' | 'PATCH' | 'DELETE', body?: string): Promise<any> {
    const API_BASE_URL = process.env.API_BASE_URL ?? ''
    const url = `${API_BASE_URL}${path}`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'hub-frontend'
    }

    if (process.env.NODE_ENV === 'production') {
      headers.Authorization = `Bearer ${await tokenFetcher.fetchToken()}`
    }

    const options: RequestInit = { method, headers, body }
    const response = await fetch(url, options)

    return await response.json()
  }
}
