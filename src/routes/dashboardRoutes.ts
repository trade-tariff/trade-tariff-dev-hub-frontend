import express, { type Router } from 'express'
import { showDashboard } from '../controllers/dashboardController'

const router: Router = express.Router()

router.get('/dashboard/:fpoId', showDashboard)

export default router
