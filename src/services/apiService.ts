import { AuthTokenFetcher } from '../utils/authTokenFetcher'
import { logger } from '../config/logging'

const API_BASE_URL = process.env.API_BASE_URL ?? ''

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
  FpoId: string
  CreatedAt: string
  UpdatedAt: string
}

export namespace ApiService {
  export async function listKeys (fpoId: string): Promise<ApiKey[]> {
    try {
      return await doRequest(
        `/api/keys/${fpoId}`,
        'GET'
      )
    } catch (error) {
      logger.error('Error fetching API keys:', error)
      throw error
    }
  }

  export async function revokeAPIKey (fpoId: string, customerKeyId: string, enabled: boolean): Promise<any> {
    try {
      return await doRequest(
        `/api/keys/${fpoId}/${customerKeyId}`,
        'PATCH',
        JSON.stringify({ enabled })
      )
    } catch (error) {
      logger.error('Error updating API key:', error)
      throw error
    }
  }

  export async function createAPIKey (fpoId: string, description: string): Promise<any> {
    try {
      return await doRequest(
        `/api/keys/${fpoId}`,
        'POST',
        JSON.stringify({ description })
      )
    } catch (error) {
      logger.error('Error updating API key:', error)
      throw error
    }
  }

  async function doRequest (path: string, method: 'GET' | 'POST' | 'PATCH', body?: string): Promise<any> {
    const url = `${API_BASE_URL}${path}`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'hub-frontend'
    }

    if (process.env.NODE_ENV === 'production') {
      logger.info('Fetching and setting token for production environment')
      headers.Authorization = `Bearer ${await tokenFetcher.fetchToken()}`
    }

    logger.info(`Requesting ${url} with method ${method}`)
    const options: RequestInit = { method, headers, body }

    const response = await fetch(url, options)

    return await response.json()
  }
}
