/* eslint-disable @typescript-eslint/no-misused-promises */

import express, { type Router } from 'express'
import { showDashboard } from '../controllers/dashboardController'
import { newKey, create } from '../controllers/keyController'
import { showRevoke, revoke } from '../controllers/revokeController'

const router: Router = express.Router()

router.get('/:fpoId', showDashboard)
router.get('/keys/:fpoId/:customerKeyId/revoke', showRevoke)
router.get('/keys/:fpoId/new', newKey)
router.post('/keys/:fpoId/create', create)
router.post('/keys/:fpoId/:customerKeyId/revoke', revoke)

export default router
