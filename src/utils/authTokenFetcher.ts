import { URLSearchParams } from 'url'
import { logger } from '../config/logging'

export interface ClientCredentials {
  access_token: string
  id_token: string
  token_type: 'Bearer'
  expires_in: number
}

interface ClientError {
  error: 'invalid_request' | 'invalid_client' | 'invalid_grant' | 'unauthorized_client' | 'unsupported_grant_type'
}

type ClientCredentialsResponse = ClientCredentials | ClientError

function isClientError (it: ClientCredentialsResponse): it is ClientError {
  return 'error' in it
}

export class AuthTokenFetcher {
  readonly #authUrl: string
  readonly #clientId: string
  readonly #clientSecret: string
  token: string = ''
  #tokenExpiresTimestamp: number = 0

  constructor (authUrl: string, clientId: string, clientSecret: string) {
    this.#authUrl = authUrl
    this.#clientId = clientId
    this.#clientSecret = clientSecret
  }

  public async fetchToken (): Promise<string> {
    const now = Math.floor(Date.now() / 1000)
    const tokenExpired: boolean = now >= this.#tokenExpiresTimestamp

    if (this.#tokenExpiresTimestamp === 0 || tokenExpired) {
      try {
        const response = await fetch(this.#authUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            client_id: this.#clientId,
            client_secret: this.#clientSecret,
            grant_type: 'client_credentials',
            scope: 'hub-backend-server/api'
          })
        })

        const data: ClientCredentialsResponse = await response.json()

        if (isClientError(data)) {
          throw new Error(data.error)
        }

        this.#tokenExpiresTimestamp = now + data.expires_in
        this.token = data.access_token
        return this.token
      } catch (err) {
        logger.error('Error fetching token:', err)
        throw err
      }
    } else {
      return this.token
    }
  }
}
