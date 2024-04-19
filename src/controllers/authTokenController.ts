import { URLSearchParams } from 'url'

interface ClientCredentialsResponse {
  access_token: string
  id_token: string
  token_type: 'Bearer'
  expires_in: number
}

export class AuthTokenController {
  readonly #authUrl: string
  readonly #clientId: string
  readonly #clientSecret: string

  constructor (authUrl: string, clientId: string, clientSecret: string) {
    this.#authUrl = authUrl
    this.#clientId = clientId
    this.#clientSecret = clientSecret
  }

  public async fetchToken (): Promise<ClientCredentialsResponse> {
    return await new Promise((resolve, reject) => {
      const request = new Request(
        this.#authUrl,
        {
          method: 'POST',
          headers: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
            client_id: this.#clientId,
            client_secret: this.#clientSecret,
            grant_type: 'client_credentials',
            scope: 'hub-backend-server/api'
          })
        }
      )

      fetch(request)
        .then(async (response) => await response.json())
        .then((data: ClientCredentialsResponse) => { resolve(data) })
        .catch((err) => { reject(err) })
    })
  }
}
