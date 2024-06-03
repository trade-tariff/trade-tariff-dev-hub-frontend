import { type Request, type Response } from 'express'
import { ApiService } from '../services/apiService'
import { ApiKeyPresenter } from '../presenters/apiKeyPresenter'
import { logger } from '../config/logging'

export const newKey = async (_req: Request, res: Response): Promise<void> => {
  try {
    res.render('newKey')
  } catch (error) {
    logger.error('Error showing create page', error)
    res.status(500).send('Error showing new key page')
  }
}

export const create = async (req: Request, res: Response): Promise<void> => {
  const apiKeyDescription = req.body.apiKeyDescription as string

  try {
    if (apiKeyDescription === '') {
      res.render('newKey')
    } else {
      const user = await ApiService.handleRequest(req)
      const apiKey = await ApiService.createAPIKey(user, apiKeyDescription)
      const secretHtml = ApiKeyPresenter.secretHtml(apiKey.Secret)
      res.render('keySuccessPage', { secretHtml })
    }
  } catch (error) {
    logger.error('Error showing create page', error)
    res.status(500).send('Error showing new key page')
  }
}
