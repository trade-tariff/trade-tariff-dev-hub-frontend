/* eslint-disable @typescript-eslint/no-misused-promises */

import express, { type Router, type Request, type Response, type NextFunction } from 'express'
import { HealthchecksController } from '../controllers/healthchecksController'
import { newVerificationPage, checkVerificationDetails, applicationComplete } from '../controllers/verificationController'
import { privacyPolicyPage } from '../controllers/privacyPolicyController'
import { cookiesPage } from '../controllers/cookiesController'
import { rejectedPage } from '../controllers/rejectedController'
import { requiresAuth } from 'express-openid-connect'
import { body } from 'express-validator'
import { returnURLPage } from '../controllers/returnURLController'

const healthchecksController = new HealthchecksController()
const router: Router = express.Router()

router.get('/', (_req: Request, res: Response, _next: NextFunction) => { res.render('index.njk') })
router.get('/healthcheck', (req, res) => { healthchecksController.show(req, res) })
router.get('/healthcheckz', (req, res) => { healthchecksController.showz(req, res) })
router.get('/privacyPolicy', privacyPolicyPage)
router.get('/cookies', cookiesPage)
router.get('/auth/profile-redirect', returnURLPage)
router.get('/auth/group-redirect', returnURLPage)

const isProduction = (process.env.NODE_ENV ?? 'development') === 'production'

if (isProduction) {
  router.use(requiresAuth())
}

const userAnswersValidator = [
  body('organisationName', 'Enter the name of your organisation').notEmpty(),
  body('eoriNumber', 'Enter your EORI number').notEmpty(),
  body('ukacsReference', 'Enter your UK Carrier Scheme (UKC) reference number').notEmpty(),
  body('emailAddress', 'Enter your work email address').notEmpty(),
  body('emailAddress', 'Enter an email address in the correct format, like name@example.com').isEmail()
]
router.get('/verification', newVerificationPage)
router.post('/check-verification', userAnswersValidator, checkVerificationDetails)
router.post('/completion', body('terms', 'You must agree to all the terms & conditions by ticking the boxes').isArray({ min: 4 }), applicationComplete)
router.get('/rejectedPage', rejectedPage)

export default router
