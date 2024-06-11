import { type Request, type Response } from 'express'
import { ApiService } from '../services/apiService'
import { CommonService } from '../services/commonService'
import { ApiKeyPresenter } from '../presenters/apiKeyPresenter'
import { logger } from '../config/logging'
import { validationResult } from 'express-validator'

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
  // Extract the validation errors from a request.
  const result = validationResult(req)
  try {
    if (result.isEmpty()) {
      const user = await CommonService.handleRequest(req)
      const apiKey = await ApiService.createAPIKey(user, apiKeyDescription)
      const secretHtml = ApiKeyPresenter.secretHtml(apiKey.Secret)
      res.render('keySuccessPage', { secretHtml })
    } else {
      res.render('newKey', { error: result })
    }
  } catch (error) {
    logger.error('Error showing create page', error)
    res.status(500).send('Error showing new key page')
  }
}
