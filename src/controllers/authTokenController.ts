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
  token: string
  #tokenExpiresTimestamp: number = 0

  constructor (authUrl: string, clientId: string, clientSecret: string) {
    this.#authUrl = authUrl
    this.#clientId = clientId
    this.#clientSecret = clientSecret
    this.token = ''
  }

  public async fetchToken (): Promise<string> {
    return await new Promise((resolve, reject) => {
      const now = Math.floor(Date.now() / 1000)
      const tokenExpired: boolean = now >= this.#tokenExpiresTimestamp

      if (this.#tokenExpiresTimestamp === 0 || tokenExpired) {
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
          .then((data: ClientCredentialsResponse) => {
            this.#tokenExpiresTimestamp = now + data.expires_in
            this.token = data.access_token
            resolve(this.token)
          })
          .catch((err) => { reject(err) })
      } else {
        resolve(this.token)
      }
    })
  }
}
