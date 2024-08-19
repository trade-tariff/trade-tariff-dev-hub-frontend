import { AuthTokenFetcher } from '../utils/authTokenFetcher'
import { logger } from '../config/logging'
import { type ScpUser } from './commonService'

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
  export async function getKey (user: ScpUser, customerKeyId: string): Promise<ApiKey> {
    logger.debug(`Fetching API key for user ${user.userId} group: ${user.groupId} key: ${customerKeyId}`)

    try {
      return await doRequest(
        {
          path: `/api/keys/${encodeURIComponent(user.groupId)}/${encodeURIComponent(customerKeyId)}`,
          method: 'GET',
          userId: user.userId
        }
      )
    } catch (error) {
      logger.error('Error fetching API key:', error)
      throw error
    }
  }

  export async function listKeys (user: ScpUser): Promise<ApiKey[]> {
    try {
      logger.debug(`Listing API keys for user ${user.userId} group: ${user.groupId}`)
      return await doRequest(
        {
          path: `/api/keys/${encodeURIComponent(user.groupId)}`,
          method: 'GET',
          userId: user.userId
        }
      )
    } catch (error) {
      logger.error('Error fetching API keys:', error)
      throw error
    }
  }

  export async function revokeAPIKey (user: ScpUser, customerKeyId: string, enabled: boolean): Promise<any> {
    try {
      logger.debug(`Revoking API key for user ${user.userId} group: ${user.groupId} key: ${customerKeyId} enabled: ${enabled}`)
      return await doRequest(
        {
          path: `/api/keys/${encodeURIComponent(user.groupId)}/${encodeURIComponent(customerKeyId)}`,
          method: 'PATCH',
          body: JSON.stringify({ enabled }),
          userId: user.userId
        }
      )
    } catch (error) {
      logger.error('Error updating API key:', error)
      throw error
    }
  }

  export async function deleteAPIKey (user: ScpUser, customerKeyId: string): Promise<any> {
    try {
      logger.debug(`Deleting API key for user ${user.userId} group: ${user.groupId} key: ${customerKeyId}`)
      return await doRequest(
        {
          path: `/api/keys/${encodeURIComponent(user.groupId)}/${encodeURIComponent(customerKeyId)}`,
          method: 'DELETE',
          userId: user.userId
        }
      )
    } catch (error) {
      logger.error('Error deleting API key:', error)
      throw error
    }
  }

  export async function createAPIKey (user: ScpUser, description: string): Promise<ApiKey> {
    try {
      logger.debug('Fetching API key for user:', user.userId, 'group:', user.groupId, 'description:', description)
      return await doRequest(
        {
          path: `/api/keys/${encodeURIComponent(user.groupId)}`,
          method: 'POST',
          body: JSON.stringify({ description }),
          userId: user.userId
        }
      )
    } catch (error) {
      logger.error('Error creating API key:', error)
      throw error
    }
  }

  interface RequestOpts {
    path: string
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE'
    userId: string
    body?: string
  }

  async function doRequest (opts: RequestOpts): Promise<any> {
    const API_BASE_URL = process.env.API_BASE_URL ?? ''
    const url = `${API_BASE_URL}${opts.path}`
    const headers: Record<string, string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': 'hub-frontend',
      'X-User-Id': opts.userId
    }

    if (process.env.NODE_ENV === 'production') {
      headers.Authorization = `Bearer ${await tokenFetcher.fetchToken()}`
    }

    const options: RequestInit = {
      method: opts.method,
      body: opts.body,
      headers
    }

    const response = await fetch(url, options)

    return await response.json()
  }
}
