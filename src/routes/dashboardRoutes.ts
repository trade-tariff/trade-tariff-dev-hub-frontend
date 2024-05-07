import express, { type Router } from 'express'
import { showDashboard } from '../controllers/dashboardController'
import { showCreatePage, showSuccessPage } from '../controllers/createKeyController'
import { showRevokePage, revokeAPIKey } from '../controllers/revokeController'

const router: Router = express.Router()

router.get('/:fpoId', showDashboard)
router.get('/keys/:fpoId/:customerKeyId/revoke', showRevokePage)
router.get('/keys/:fpoId/create', showCreatePage)
router.post('/keys/:fpoId/success', showSuccessPage)
router.post('/keys/:fpoId/:customerKeyId/revoke', revokeAPIKey)

export default router
