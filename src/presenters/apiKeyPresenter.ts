import { type ApiKey } from '../../src/services/apiService'

export namespace ApiKeyPresenter {
  export function secretHtml (apiKey: ApiKey): any {
    return `Your API Key is <br><strong style="font-size: 1rem;"> ${apiKey.Secret} </strong>`
  }
}
