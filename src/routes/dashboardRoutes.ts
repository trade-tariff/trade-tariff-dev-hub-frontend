/* eslint-disable @typescript-eslint/no-misused-promises */

import express, { type Router } from 'express'
import { requiresAuth } from 'express-openid-connect'

import { newKey, create } from '../controllers/keyController'
import { showDashboard } from '../controllers/dashboardController'
import { showDeleteKey, deleteKey } from '../controllers/deleteController'
import { showRevoke, revoke } from '../controllers/revokeController'
import { body } from 'express-validator'

const router: Router = express.Router()

const isProduction = (process.env.NODE_ENV ?? 'development') === 'production'
const deletionEnabled = (process.env.DELETION_ENABLED ?? 'false') === 'true'

if (isProduction) { router.use(requiresAuth()) }

router.get('/', showDashboard)

router.get('/new', newKey)
router.post('/create', body('description', 'Enter the description for your API key').notEmpty(), create)

router.get('/:customerKeyId/revoke', showRevoke)
router.post('/:customerKeyId/revoke', revoke)

if (deletionEnabled) {
  router.get('/:customerKeyId/delete', showDeleteKey)
  router.post('/:customerKeyId/delete', deleteKey)
}

export default router
