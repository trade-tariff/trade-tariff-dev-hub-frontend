import { type Request, type Response } from 'express'
import { logger } from '../config/logging'

// User is registered
// User sees dashboard

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
  res.render('completion')
}
