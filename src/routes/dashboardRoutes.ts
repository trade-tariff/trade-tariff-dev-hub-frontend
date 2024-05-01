import express, { type Router } from 'express'
import { showDashboard } from '../controllers/dashboardController'

const router: Router = express.Router()

/* eslint-disable @typescript-eslint/no-floating-promises */
router.get('/:fpoId', (req, res) => { showDashboard(req, res) })
/* eslint-enable @typescript-eslint/no-floating-promises */

export default router
