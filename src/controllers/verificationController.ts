import { type Request, type Response } from 'express'
import { logger } from '../config/logging'

export const newVerificationPage = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.Id

  console.log("saldfknks.damfn")
  try {
    res.render('verification', { id })
  } catch (error) {
    logger.error('Error fetching API keys:', error)
    res.status(500).send('Error fetching API keys')
  }
}

export const checkVerificationDetails = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.Id

  try {
    res.render('checkVerification', { id })
  } catch (error) {
    logger.error('Error fetching API keys:', error)
    res.status(500).send('Error fetching API keys')
  }
}
