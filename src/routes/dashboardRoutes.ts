import express, { type Router } from 'express'
import { showDashboard, showRevokePage, revokeAPIKey } from '../controllers/dashboardController'

const router: Router = express.Router()

/* eslint-disable @typescript-eslint/no-floating-promises */
router.get('/:fpoId', (req, res) => { showDashboard(req, res) })
/* eslint-enable @typescript-eslint/no-floating-promises */
router.get('/dashboard/:fpoId', showDashboard)
router.get('/keys/:fpoId/:customerKeyId/revoke', showRevokePage)
router.post('/keys/:fpoId/:customerKeyId/revoke', revokeAPIKey)

export default router
