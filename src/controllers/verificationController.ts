import { type Request, type Response } from 'express'
import { logger } from '../config/logging'
import { validationResult } from 'express-validator'

export const newVerificationPage = async (req: Request, res: Response): Promise<void> => {
  res.render('verification')
}

export const checkVerificationDetails = async (req: Request, res: Response): Promise<void> => {
  const body = req.body

  try {
    res.render('checkVerification', { body })
  } catch (error) {
    logger.error('Error fetching API keys:', error)
    res.status(500).send('Error fetching API keys')
  }
}

export const applicationComplete = async (req: Request, res: Response): Promise<void> => {
  const body = req.body
  const result = validationResult(req)

  try {
    if (result.isEmpty()) {
      res.render('completion')
    } else {
      res.render('checkVerification', { body, error: result })
    }
  } catch (error) {
    logger.error('Error fetching API keys:', error)
    res.status(500).send('Error fetching API keys')
  }
}
