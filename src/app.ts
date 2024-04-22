import { type Express, type Request, type Response, type NextFunction } from 'express'

import createError from 'http-errors'
import express from 'express'
import path from 'path'
import expressNunjucks from 'express-nunjucks'

import indexRouter from './routes/index'
import initEnvironment from './config/env'
import favicon from 'serve-favicon'

initEnvironment()

const app: Express = express()

const isDev = app.get('env') === 'development'
const port = process.env.PORT ?? 8080

if (isDev) {
  const morgan = require('morgan')
  app.use(morgan('dev'))
} else {
  const authUrl = process.env.COGNITO_AUTH_URL ?? undefined
  const clientId = process.env.COGNITO_CLIENT_ID ?? undefined
  const clientSecret = process.env.COGNITO_CLIENT_SECRET ?? undefined

  if (authUrl === undefined) throw new Error('COGNITO_AUTH_URL undefined.')
  if (clientId === undefined) throw new Error('COGNITO_CLIENT_ID undefined.')
  if (clientSecret === undefined) throw new Error('COGNITO_CLIENT_SECRET undefined.')
}

const templateConfig = {
  autoescape: true,
  watch: isDev,
  noCache: isDev
}

expressNunjucks(app, templateConfig as any)

app.use(favicon(path.join('public', 'favicon.ico')))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join('public')))

app.use('/', indexRouter)

// catch 404 and forward to error handler
app.use(function (_req: Request, _res: Response, next: NextFunction) {
  next(createError(404))
})

// Error handler
app.use(function (err: any, req: Request, res: Response, _next: NextFunction) {
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  res.status(err.status || 500)

  res.json({
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}
  })
})

app.listen(port, () => {
  console.log(`Server running on ${port}`)
})
