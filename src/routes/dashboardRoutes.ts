/* eslint-disable @typescript-eslint/no-misused-promises */

import express, { type Router } from 'express'
import { showDashboard } from '../controllers/dashboardController'
import { newKey, create } from '../controllers/keyController'
import { showRevoke, revoke } from '../controllers/revokeController'
import { requiresAuth } from 'express-openid-connect'

export default function DashboardRoutes (isDev: boolean): Router {
  const router: Router = express.Router()
  router.get('/:organisationId', requiresAuth((req) => !isDev), showDashboard)
  router.get('/keys/:organisationId/:customerKeyId/revoke', requiresAuth((req) => !isDev), showRevoke)
  router.get('/keys/:organisationId/new', requiresAuth(), newKey)
  router.post('/keys/:organisationId/create', requiresAuth((req) => !isDev), create)
  router.post('/keys/:organisationId/:customerKeyId/revoke', requiresAuth((req) => !isDev), revoke)
  return router
}
