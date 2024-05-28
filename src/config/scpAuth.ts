import { type RequestHandler } from 'express'
import { auth } from 'express-openid-connect'

interface ScpConfiguration {
  middleware: RequestHandler
  baseURL: string
}

export const configureAuth = (): ScpConfiguration => {
  const issuerBaseURL = process.env.SCP_OPEN_ID_ISSUER_BASE_URL ?? undefined
  const clientID = process.env.SCP_OPEN_ID_CLIENT_ID ?? undefined
  const clientSecret = process.env.SCP_OPEN_ID_CLIENT_SECRET ?? undefined
  const secret = process.env.SCP_OPEN_ID_SECRET ?? undefined
  const callback = process.env.SCP_OPEN_ID_CALLBACK_PATH ?? undefined
  const audience = process.env.SCP_OPEN_ID_BASE_URL ?? undefined

  if (issuerBaseURL === undefined) throw new Error('SCP_OPEN_ID_ISSUER_BASE_URL undefined.')
  if (clientID === undefined) throw new Error('SCP_OPEN_ID_CLIENT_ID undefined.')
  if (clientSecret === undefined) throw new Error('SCP_OPEN_ID_CLIENT_SECRET undefined.')
  if (secret === undefined) throw new Error('SCP_OPEN_ID_SECRET undefined.')
  if (callback === undefined) throw new Error('SCP_OPEN_ID_CALLBACK_PATH undefined.')
  if (audience === undefined) throw new Error('SCP_OPEN_ID_BASE_URL undefined.')
  const configuredAuth = auth({
    baseURL: audience,
    issuerBaseURL,
    clientID,
    clientSecret,
    secret,
    idpLogout: true,
    routes: { callback },
    authorizationParams: {
      response_type: 'code',
      scope: 'openid email',
      audience
    },
    authRequired: false,
    afterCallback: async (_req, _res, session, _decodedState) => {
      const userProfile = await fetch(`${issuerBaseURL}/userinfo`)

      return { ...session, userProfile }
    }
  })

  return {
    middleware: configuredAuth,
    baseURL: audience
  }
}
