/* eslint-disable @typescript-eslint/no-misused-promises */

import express, { type Router } from 'express'
import { requiresAuth } from 'express-openid-connect'

import { newKey, create } from '../controllers/keyController'
import { showDashboard } from '../controllers/dashboardController'
import { showDeleteKey, deleteKey } from '../controllers/deleteController'
import { showRevoke, revoke } from '../controllers/revokeController'

const router: Router = express.Router()

const isProduction = (process.env.NODE_ENV ?? 'development') === 'production'
const deletionEnabled = (process.env.DELETION_ENABLED ?? 'false') === 'true'

if (isProduction) { router.use(requiresAuth()) }

router.get('/:organisationId', showDashboard)
router.get('/keys/:organisationId/:customerKeyId/revoke', showRevoke)
router.get('/keys/:organisationId/new', newKey)
router.post('/keys/:organisationId/:customerKeyId/revoke', revoke)
router.post('/keys/:organisationId/create', create)

if (deletionEnabled) {
  router.get('/keys/:organisationId/:customerKeyId/delete', showDeleteKey)
  router.post('/keys/:organisationId/:customerKeyId/delete', deleteKey)
}

export default router
