/* eslint-disable @typescript-eslint/no-misused-promises */

import express, { type Router, type Request, type Response, type NextFunction } from 'express'
import { HealthchecksController } from '../controllers/healthchecksController'
import { newVerificationPage, checkVerificationDetails, applicationComplete } from '../controllers/verificationController'
import { privacyPolicyPage } from '../controllers/privacyPolicyController'
import { cookiesPage } from '../controllers/cookiesController'
import { rejectedPage } from '../controllers/rejectedController'
import { requiresAuth } from 'express-openid-connect'
import registration from '../config/registration'

const healthchecksController = new HealthchecksController()
const router: Router = express.Router()

router.get('/', (_req: Request, res: Response, _next: NextFunction) => { res.render('index.njk') })
router.get('/healthcheck', (req, res) => { healthchecksController.show(req, res) })
router.get('/healthcheckz', (req, res) => { healthchecksController.showz(req, res) })
router.get('/privacyPolicy', privacyPolicyPage)
router.get('/cookies', cookiesPage)

const isProduction = (process.env.NODE_ENV ?? 'development') === 'production'

if (isProduction) {
  router.use(requiresAuth())
  router.use(registration)
}

router.get('/verification', newVerificationPage)
router.post('/check-verification', checkVerificationDetails)
router.post('/completion', applicationComplete)
router.get('/rejectedPage', rejectedPage)

export default router
