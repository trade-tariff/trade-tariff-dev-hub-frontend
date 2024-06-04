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

interface ScpUser {
  groupId: string
  userId: string
}

export namespace ApiService {
  export async function getKey (user: ScpUser, customerKeyId: string): Promise<ApiKey> {
    try {
      return await doRequest(
        {
          path: `/api/keys/${user.groupId}/${customerKeyId}`,
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
      return await doRequest(
        {
          path: `/api/keys/${user.groupId}`,
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
      return await doRequest(
        {
          path: `/api/keys/${user.groupId}/${customerKeyId}`,
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
      return await doRequest(
        {
          path: `/api/keys/${user.groupId}/${customerKeyId}`,
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
      return await doRequest(
        {
          path: `/api/keys/${user.groupId}`,
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

  export async function handleRequest (req: any): Promise<ScpUser> {
    const env = process.env.NODE_ENV ?? 'development'
    const userProfile = req.appSession?.userProfile ?? null

    if (userProfile === null) {
      if (env === 'production') throw new Error('User not authenticated')

      return {
        userId: 'local-development',
        groupId: 'local-development'
      }
    }

    if (req.oidc.isAuthenticated() === false) if (env === 'production') throw new Error('User not authenticated')

    const userId = userProfile.sub ?? ''
    const groupId = userProfile['bas:groupId'] ?? ''

    if (userId === '') throw new Error('User sub not set')
    if (groupId === '') throw new Error('User bas:groupId not set')

    return { userId, groupId }
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
