import { type Express, type Request, type Response, type NextFunction } from 'express'
import cookieSession from 'cookie-session'
import createError from 'http-errors'
import express from 'express'
import favicon from 'serve-favicon'
import morgan from 'morgan'
import nunjucks from 'nunjucks'
import path from 'path'

import dashboardRoutes from './routes/dashboardRoutes'
import indexRouter from './routes/index'

import initEnvironment from './config/env'
import mainNavigationOptions from './config/main-navigation-options'
import validateCognitoConfig from './config/cognitoAuth'
import { configureAuth } from './config/scpAuth'
import { httpRequestLoggingMiddleware, logger } from './config/logging'
import config from './config/config'
import { configureSecurity } from './config/security'
import csrf from 'csurf'

initEnvironment()

const app: Express = express()

const isDev = app.get('env') === 'development'
const port = process.env.PORT ?? 8080
const cookieSigningSecret = process.env.COOKIE_SIGNING_SECRET ?? ''

const templateConfig: nunjucks.ConfigureOptions = {
  autoescape: true,
  watch: isDev,
  express: app,
  noCache: isDev
}

const nunjucksConfiguration = nunjucks.configure(
  [
    'node_modules/govuk-frontend/dist',
    'views'
  ],
  templateConfig
)

nunjucksConfiguration.addGlobal('config', config)

if (isDev) {
  app.use(morgan('dev'))
  nunjucksConfiguration.addGlobal('baseURL', `http://localhost:${port}`)
} else {
  const scpConfiguration = configureAuth()

  validateCognitoConfig()
  app.use(httpRequestLoggingMiddleware())
  app.use(scpConfiguration.middleware)
  nunjucksConfiguration.addGlobal('baseURL', scpConfiguration.baseURL)
}

configureSecurity(app)

app.disable('x-powered-by')

app.use(mainNavigationOptions)

app.set('view engine', 'njk')

app.use(favicon(path.join('public', 'favicon.ico')))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/govuk', express.static('node_modules/govuk-frontend/dist/govuk'))
app.use('/assets', express.static('node_modules/govuk-frontend/dist/govuk/assets'))
app.use(express.static('public'))

app.use(cookieSession({
  name: 'session',
  keys: [cookieSigningSecret],
  maxAge: 24 * 60 * 60 * 1000
}))

// const csrfProtection = csrf({ cookie: true });
app.use(csrf())

app.use('/', indexRouter)
app.use('/dashboard', dashboardRoutes)

// catch 404 and forward to error handler
app.use(function (_req: Request, _res: Response, next: NextFunction) {
  next(createError(404))
})

// Error handler
app.use(function (err: any, req: Request, res: Response, _next: NextFunction) {
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  const statusCode: number = err.statusCode ?? 500

  res.status(statusCode)

  res.json({
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}
  })
})

app.listen(port, () => {
  logger.info(`Server running on ${port}`)
})
