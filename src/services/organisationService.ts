import { AuthTokenFetcher } from '../utils/authTokenFetcher'
import { logger } from '../config/logging'

const tokenFetcher = new AuthTokenFetcher(
  process.env.COGNITO_AUTH_URL ?? '',
  process.env.COGNITO_CLIENT_ID ?? '',
  process.env.COGNITO_CLIENT_SECRET ?? ''
)

export interface Organisation {
  OrganisationId: string
  Status: string
  ApplicationReference: string
  CreatedAt: string
  UpdatedAt: string
}

export namespace OrganisationService {
  export async function getOrganisation (organisationId: string): Promise<Organisation> {
    try {
      logger.debug(`Fetching organisation with id ${organisationId}`)
      return await doRequest(
        {
          path: `/api/organisations/${organisationId}`,
          method: 'GET',
          organisationId
        }
      )
    } catch (error) {
      logger.error('Error fetching Organisation', error)
      throw error
    }
  }

  export async function updateOrganisation (organisationId: string, applicationReference: string, organisationName: string, eoriNumber: string, ukAcsReference: string): Promise<Organisation> {
    const status: string = 'Pending'
    try {
      logger.debug(`Updating organisation ${organisationId}`)
      return await doRequest(
        {
          path: `/api/organisations/${organisationId}`,
          method: 'PATCH',
          body: JSON.stringify({ applicationReference, status, organisationName, eoriNumber, ukAcsReference }),
          organisationId
        }
      )
    } catch (error) {
      logger.error('Error updating organisation :', error)
      throw error
    }
  }

  interface RequestOpts {
    path: string
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE'
    organisationId: string
    body?: string
  }

  async function doRequest (opts: RequestOpts): Promise<any> {
    const API_BASE_URL = process.env.API_BASE_URL ?? ''
    const url = `${API_BASE_URL}${opts.path}`
    const headers: Record<string, string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Organisation-Agent': 'hub-frontend',
      'X-Organisation-Id': opts.organisationId
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
