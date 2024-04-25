import 'jasmine'

import { AuthTokenFetcher, type ClientCredentials } from '../src/utils/authTokenFetcher'

const authUrl = 'https://auth.trade-tariff.service.gov.uk/oauth2/token'
const clientId = '1example23456789'
const clientSecret = '9example87654321'

let authTokenFetcher: AuthTokenFetcher

beforeEach(() => {
  authTokenFetcher = new AuthTokenFetcher(authUrl, clientId, clientSecret)
})

describe('authTokenFetcher', () => {
  it('returns an access token', async () => {
    const mockData: ClientCredentials = {
      access_token: 'eyJra1example',
      id_token: 'eyJra2example',
      token_type: 'Bearer',
      expires_in: 3600
    }

    const mockResponse = new Response(JSON.stringify(mockData))
    spyOn(global, 'fetch').and.returnValue(Promise.resolve(mockResponse))

    const token = await authTokenFetcher.fetchToken()

    expect(fetch).toHaveBeenCalled()
    expect(token).toBe(mockData.access_token)
  })

  it('refreshes expired tokens', async () => {
    const mockData: ClientCredentials = {
      access_token: 'eyJra1example',
      id_token: 'eyJra2example',
      token_type: 'Bearer',
      expires_in: 1 // mock a short expiry time for test
    }

    const mockResponse = new Response(JSON.stringify(mockData))
    spyOn(global, 'fetch').and.returnValues(Promise.resolve(mockResponse.clone()), Promise.resolve(mockResponse.clone()))

    let token = await authTokenFetcher.fetchToken()
    await new Promise(r => setTimeout(r, 2000));
    token = await authTokenFetcher.fetchToken()

    expect(fetch).toHaveBeenCalledTimes(2)
  })

  it('caches valid tokens', async () => {
    const mockData: ClientCredentials = {
      access_token: 'eyJra1example',
      id_token: 'eyJra2example',
      token_type: 'Bearer',
      expires_in: 3600
    }

    const mockResponse = new Response(JSON.stringify(mockData))
    spyOn(global, 'fetch').and.returnValues(Promise.resolve(mockResponse.clone()), Promise.resolve(mockResponse.clone()))

    let token = await authTokenFetcher.fetchToken()
    await new Promise(r => setTimeout(r, 2000));
    token = await authTokenFetcher.fetchToken()

    expect(fetch).toHaveBeenCalledTimes(1)
  })
})
