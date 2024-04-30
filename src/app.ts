import { type Express, type Request, type Response, type NextFunction } from 'express'

import createError from 'http-errors'
import express from 'express'
import path from 'path'
import nunjucks from 'nunjucks'
import morgan from 'morgan'

import indexRouter from './routes/index'
import dashboardRoutes from './routes/dashboardRoutes'
import { httpRequestLoggingMiddleware, logger } from './config/logging'
import initEnvironment from './config/env'
import favicon from 'serve-favicon'

initEnvironment()

const app: Express = express()

const isDev = app.get('env') === 'development'
const port = process.env.PORT ?? 8080

if (isDev) {
  app.use(morgan('dev'))
} else {
  const authUrl = process.env.COGNITO_AUTH_URL ?? undefined
  const clientId = process.env.COGNITO_CLIENT_ID ?? undefined
  const clientSecret = process.env.COGNITO_CLIENT_SECRET ?? undefined

  if (authUrl === undefined) throw new Error('COGNITO_AUTH_URL undefined.')
  if (clientId === undefined) throw new Error('COGNITO_CLIENT_ID undefined.')
  if (clientSecret === undefined) throw new Error('COGNITO_CLIENT_SECRET undefined.')

  app.use(httpRequestLoggingMiddleware())
}

const templateConfig = {
  autoescape: true,
  watch: isDev,
  express: app,
  noCache: isDev
}

nunjucks.configure([
  'node_modules/govuk-frontend/dist',
  'views'
], templateConfig as any)

app.set('view engine', 'njk')

app.use(favicon(path.join('public', 'favicon.ico')))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/govuk', express.static('node_modules/govuk-frontend/dist/govuk'))
app.use('/assets', express.static('node_modules/govuk-frontend/dist/govuk/assets'))
app.use(express.static('public'))

app.engine('html', nunjucks.render)
app.set('view engine', 'html')

app.use('/', indexRouter)
app.use(dashboardRoutes)

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
  logger.info(`Server running on ${port}`)
})
