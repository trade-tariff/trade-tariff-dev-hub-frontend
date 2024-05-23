/* eslint-disable @typescript-eslint/no-misused-promises */

import express, { type Router } from 'express'
import { showDashboard } from '../controllers/dashboardController'
import { newKey, create } from '../controllers/keyController'
import { showRevoke, revoke } from '../controllers/revokeController'
import { requiresAuth } from 'express-openid-connect'

const router: Router = express.Router()

const isProduction = (process.env.NODE_ENV ?? 'development') === 'production'

if (isProduction) { router.use(requiresAuth()) }

router.get('/:organisationId', showDashboard)
router.get('/keys/:organisationId/:customerKeyId/revoke', showRevoke)
router.get('/keys/:organisationId/new', newKey)
router.post('/keys/:organisationId/create', create)
router.post('/keys/:organisationId/:customerKeyId/revoke', revoke)

export default router
