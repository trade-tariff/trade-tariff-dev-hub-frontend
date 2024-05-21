/* eslint-disable @typescript-eslint/no-misused-promises */

import express, { type Router } from 'express'

import { newVerificationPage, checkVerificationDetails, applicationComplete } from '../controllers/verificationController'

const router: Router = express.Router()

router.get('/:id/verification', newVerificationPage)
router.post('/:id/check-verification', checkVerificationDetails)
router.post('/:id/completion', applicationComplete)

export default router
