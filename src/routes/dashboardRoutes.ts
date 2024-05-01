import express, { type Router } from 'express'
import { showDashboard, showRevokePage, revokeAPIKey } from '../controllers/dashboardController'

const router: Router = express.Router()

/* eslint-disable @typescript-eslint/no-floating-promises */
router.get('/:fpoId', (req, res) => { showDashboard(req, res) })
router.get('/keys/:fpoId/:customerKeyId/revoke', (req, res) => { showRevokePage(req, res) })
router.post('/keys/:fpoId/:customerKeyId/revoke', (req, res) => { revokeAPIKey(req, res) })
/* eslint-enable @typescript-eslint/no-floating-promises */

export default router
