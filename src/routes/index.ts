/* eslint-disable @typescript-eslint/no-misused-promises */

import express, { type Router, type Request, type Response, type NextFunction } from 'express'
import { HealthchecksController } from '../controllers/healthchecksController'
import { newVerificationPage, checkVerificationDetails, applicationComplete } from '../controllers/verificationController'

const healthchecksController = new HealthchecksController()
const router: Router = express.Router()

router.get('/', (_req: Request, res: Response, _next: NextFunction) => { res.render('index.njk') })
router.get('/healthcheck', (req, res) => { healthchecksController.show(req, res) })
router.get('/healthcheckz', (req, res) => { healthchecksController.showz(req, res) })

router.get('/:id/verification', newVerificationPage)
router.post('/:id/check-verification', checkVerificationDetails)
router.post('/:id/completion', applicationComplete)
export default router
