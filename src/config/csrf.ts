import { type NextFunction, type Application, type Response, type Request } from 'express'
import { doubleCsrf } from 'csrf-csrf'

const csrfSecret = process.env.CSRF_SIGNING_SECRET ?? ''
const csrfCookieName = '_csrf'

export const { generateToken, doubleCsrfProtection, invalidCsrfTokenError } =
  doubleCsrf({
    getSecret: () => csrfSecret,
    cookieName: csrfCookieName,
    getTokenFromRequest: (req) => {
      return req.body._csrf
    }
  })

export const configureCSRF = (app: Application): void => {
  app.use(doubleCsrfProtection)
}

export const csrfErrorHandler = (error: any, req: Request, res: Response, next: NextFunction): void => {
  if (error === invalidCsrfTokenError) {
    res.status(403).json({
      error: 'csrf validation error'
    })
  } else {
    next()
  }
}
