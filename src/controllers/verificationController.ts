import { type Request, type Response } from 'express'
import { logger } from '../config/logging'

export const newVerificationPage = async (req: Request, res: Response): Promise<void> => {
  const session = req.session ?? {}
  session.organisationName = session.organisationName ?? ''
  session.eoriNumber = session.eoriNumber ?? ''
  session.ukacsReference = session.ukacsReference ?? ''
  session.emailAddress = session.emailAddress ?? ''
  res.render('verification', { session })
}

export const checkVerificationDetails = async (req: Request, res: Response): Promise<void> => {
  const body = req.body
  const session = req.session ?? {}
  session.organisationName = body.organisationName ?? ''
  session.eoriNumber = body.eoriNumber ?? ''
  session.ukacsReference = body.ukacsReference ?? ''
  session.emailAddress = body.emailAddress ?? ''
  try {
    res.render('checkVerification', { body, session })
  } catch (error) {
    logger.error('Error fetching API keys:', error)
    res.status(500).send('Error fetching API keys')
  }
}

export const applicationComplete = async (req: Request, res: Response): Promise<void> => {
  req.session = null
  res.render('completion')
}
