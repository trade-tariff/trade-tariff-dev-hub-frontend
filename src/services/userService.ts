import { AuthTokenFetcher } from '../utils/authTokenFetcher'
import { logger } from '../config/logging'
import { type ScpUser } from '../services/commonService'

const tokenFetcher = new AuthTokenFetcher(
  process.env.COGNITO_AUTH_URL ?? '',
  process.env.COGNITO_CLIENT_ID ?? '',
  process.env.COGNITO_CLIENT_SECRET ?? ''
)

export interface User {
  UserId: string
  Status: string
  OrganisationId: string
  CreatedAt: string
  UpdatedAt: string
}

export namespace UserService {
  export async function getUser (user: ScpUser): Promise<User> {
    try {
      logger.debug(`Fetching user ${user.userId} with group ${user.groupId}`)
      return await doRequest(
        {
          path: `/api/users/${encodeURIComponent(user.userId)}`,
          method: 'GET',
          userId: user.userId
        }
      )
    } catch (error) {
      logger.error('Error fetching User', error)
      throw error
    }
  }
  export async function createUser (user: ScpUser): Promise<User> {
    const organisationId = user.groupId

    try {
      logger.debug(`Creating user ${user.userId} with organisation ${organisationId}`)
      return await doRequest(
        {
          path: `/api/users/${encodeURIComponent(user.userId)}`,
          method: 'POST',
          body: JSON.stringify({ organisationId }),
          userId: user.userId
        }
      )
    } catch (error) {
      logger.error('Error creating a user :', error)
      throw error
    }
  }
  export async function updateUser (user: ScpUser, emailAddress: string): Promise<User> {
    try {
      logger.debug(`Updating user ${user.userId}`)
      return await doRequest(
        {
          path: `/api/users/${encodeURIComponent(user.userId)}`,
          method: 'PATCH',
          body: JSON.stringify({ emailAddress }),
          userId: user.userId
        }
      )
    } catch (error) {
      logger.error('Error updating user :', error)
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
