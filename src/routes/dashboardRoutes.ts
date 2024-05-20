/* eslint-disable @typescript-eslint/no-misused-promises */

import express, { type Router } from 'express'
import { showDashboard } from '../controllers/dashboardController'
import { newKey, create } from '../controllers/keyController'
import { showRevoke, revoke } from '../controllers/revokeController'
import { requiresAuth } from 'express-openid-connect'

const router: Router = express.Router()

router.get('/:fpoId', requiresAuth(), showDashboard)
router.get('/keys/:fpoId/:customerKeyId/revoke', requiresAuth(), showRevoke)
router.get('/keys/:fpoId/new', requiresAuth(), newKey)
router.post('/keys/:fpoId/create', requiresAuth(), create)
router.post('/keys/:fpoId/:customerKeyId/revoke', requiresAuth(), revoke)

export default router
