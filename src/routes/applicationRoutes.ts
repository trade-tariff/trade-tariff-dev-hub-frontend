/* eslint-disable @typescript-eslint/no-misused-promises */

import express, { type Router } from 'express'

import { newVerificationPage, checkVerificationDetails } from '../controllers/verificationController'

const router: Router = express.Router()

router.get('/:id/verification', newVerificationPage)
router.get('/:id/check-verification', checkVerificationDetails)

export default router
