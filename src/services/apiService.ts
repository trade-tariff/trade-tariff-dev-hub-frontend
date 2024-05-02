const API_BASE_URL = process.env.API_BASE_URL ?? ''

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
      const response = await fetch(`${API_BASE_URL}/api/keys/${fpoId}`)
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching API keys:', error)
      throw error
    }
  }

  export async function revokeAPIKey (fpoId: string, customerKeyId: string, enabled: boolean): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/keys/${fpoId}/${customerKeyId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ enabled })
      })
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error updating API key:', error)
      throw error
    }
  }

  export async function createAPIKey (fpoId: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/keys/${fpoId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error updating API key:', error)
      throw error
    }
  }
}
