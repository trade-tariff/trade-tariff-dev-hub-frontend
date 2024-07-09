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
  OrganisationName: string
  EoriNumber: string
  UkAcsReference: string
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

  export async function updateOrganisation (organisation: Organisation): Promise<Organisation> {
    const status: string = 'Pending'
    const applicationReference = organisation.ApplicationReference
    const organisationName = organisation.OrganisationName
    const eoriNumber = organisation.EoriNumber
    const ukAcsReference = organisation.UkAcsReference
    const organisationId = organisation.OrganisationId
    try {
      logger.debug(`Updating organisation ${organisation.OrganisationId}`)
      return await doRequest(
        {
          path: `/api/organisations/${organisation.OrganisationId}`,
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
