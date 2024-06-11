import { logger } from '../config/logging'

export interface User {
  UserId: string
  Status: string
  OrganisationId: string
  CreatedAt: string
  UpdatedAt: string
}

interface ScpUser {
  groupId: string
  userId: string
}

export namespace UserService {
  export async function getUser (user: ScpUser): Promise<User> {
    try {
      return await doRequest(
        {
          path: `/api/users/${user.userId}`,
          method: 'GET'
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
      return await doRequest(
        {
          path: `/api/users/${user.userId}`,
          method: 'POST',
          body: JSON.stringify({ organisationId })
        }
      )
    } catch (error) {
      logger.error('Error creating a user :', error)
      throw error
    }
  }

  interface RequestOpts {
    path: string
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE'
    body?: string
  }

  async function doRequest (opts: RequestOpts): Promise<any> {
    const API_BASE_URL = process.env.API_BASE_URL ?? ''
    const url = `${API_BASE_URL}${opts.path}`
    const headers: Record<string, string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': 'hub-frontend'
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
