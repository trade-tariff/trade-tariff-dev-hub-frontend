import { type Application, type Response } from 'express'
import crypto from 'crypto'
import helmet from 'helmet'

export const configureSecurity = (app: Application): void => {
  app.use((req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
      if (err !== null) {
        next(err)
        return
      }

      res.locals.cspNonce = buffer.toString('hex')
      next()
    })
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
