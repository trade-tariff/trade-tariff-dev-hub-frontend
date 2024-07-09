/* eslint-disable @typescript-eslint/no-misused-promises */

import express, { type Router, type Request, type Response, type NextFunction } from 'express'
import { HealthchecksController } from '../controllers/healthchecksController'
import { newVerificationPage, checkVerificationDetails, applicationComplete } from '../controllers/verificationController'
import { privacyPolicyPage } from '../controllers/privacyPolicyController'
import { cookiesPage } from '../controllers/cookiesController'
import { rejectedPage } from '../controllers/rejectedController'
import { requiresAuth } from 'express-openid-connect'
import { body } from 'express-validator'

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
}

const userAnswersValidator = [
  body('organisationName', 'Enter the name of the organisation you are accessing the Commodity Code Tool on behalf of').notEmpty(),
  body('eoriNumber', 'Enter your Economic Operators Registration and Identification (EORI) number').notEmpty(),
  body('ukacsReference', 'Enter your UK Carrier Scheme (UKC) reference number').notEmpty(),
  body('emailAddress', 'Enter your email').isEmail()
]
router.get('/verification', newVerificationPage)
router.post('/check-verification', userAnswersValidator, checkVerificationDetails)
router.post('/completion', body('terms', 'Select all the terms & conditions.').isArray({ min: 4 }), applicationComplete)
router.get('/rejectedPage', rejectedPage)

export default router
