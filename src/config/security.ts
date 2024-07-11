import { type Application, type Response } from 'express'
import crypto from 'crypto'
import helmet from 'helmet'

export const configureSecurity = (app: Application): void => {
  app.use((req, res, next) => {
    res.locals.cspNonce = crypto.randomBytes(32).toString('hex')
    next()
  })
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          scriptSrc: ["'self'", (req, res) => `'nonce-${(res as Response).locals.cspNonce}'`]
        }
      }
    })
  )
}
