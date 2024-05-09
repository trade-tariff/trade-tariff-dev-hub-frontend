import { AuthTokenFetcher } from '../utils/authTokenFetcher'

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
      const response = await doRequest(`/api/keys/${fpoId}`, 'GET')
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching API keys:', error)
      throw error
    }
  }

  export async function revokeAPIKey (fpoId: string, customerKeyId: string, enabled: boolean): Promise<any> {
    try {
      const response = await doRequest(`/api/keys/${fpoId}/${customerKeyId}`, 'PATCH', JSON.stringify({ enabled }))
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error updating API key:', error)
      throw error
    }
  }

  export async function createAPIKey (fpoId: string, description: string): Promise<any> {
    try {
      console.log(description)
      const response = await doRequest(`/api/keys/${fpoId}`, 'POST', JSON.stringify({ description }))
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error updating API key:', error)
      throw error
    }
  }

  async function doRequest (path: string, method: 'GET' | 'POST' | 'PATCH', body?: string): Promise<Response> {
    const url = `${API_BASE_URL}${path}`
    const token = await tokenFetcher.fetchToken()
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'User-Agent': 'hub-frontend'
    }

    const options: RequestInit = { method, headers, body }

    return await window.fetch(url, options)
  }
}
