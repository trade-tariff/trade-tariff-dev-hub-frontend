import axios from 'axios'

const API_BASE_URL = 'http://localhost:5001'

export class ApiService {
  static async listKeys (fpoId: string): Promise<any> {
    try {
      const response = await axios.get(`${API_BASE_URL}/keys/${fpoId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching API keys:', error)
      throw error
    }
  }

  static async updateKey (fpoId: string, id: string, enabled: boolean): Promise<any> {
    try {
      const response = await axios.patch(`${API_BASE_URL}/keys/${fpoId}/${id}`, { enabled })
      return response.data
    } catch (error) {
      console.error('Error updating API key:', error)
      throw error
    }
  }
}
