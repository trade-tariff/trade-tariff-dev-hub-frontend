import axios from 'axios'

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
      const response = await axios.get(`${API_BASE_URL}/keys/${fpoId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching API keys:', error)
      throw error
    }
  }

  export async function updateKey (fpoId: string, id: string, enabled: boolean): Promise<ApiKey> {
    try {
      const response = await axios.patch(`${API_BASE_URL}/keys/${fpoId}/${id}`, { enabled })
      return response.data
    } catch (error) {
      console.error('Error updating API key:', error)
      throw error
    }
  }
}
