import { type Request, type Response } from 'express'
import { type ApiKey, ApiService } from '../services/apiService'
import { ApiKeyPresenter } from '../presenters/apiKeyPresenter'
import { logger } from '../config/logging'

export const newKey = async (req: Request, res: Response): Promise<void> => {
  const organisationId = req.params.organisationId

  try {
    res.render('newKey', { organisationId })
  } catch (error) {
    logger.error('Error showing create page', error)
    res.status(500).send('Error showing new key page')
  }
}

export const create = async (req: Request, res: Response): Promise<void> => {
  const organisationId = req.params.organisationId
  const apiKeyDescription = req.body.apiKeyDescription as string

  try {
    const apiKey = await ApiService.createAPIKey(organisationId, apiKeyDescription)

    const formattedData = ApiKeyPresenter.secretHtml(apiKey as ApiKey)

    res.render('keySuccessPage', { formattedData, organisationId })
  } catch (error) {
    logger.error('Error showing create page', error)
    res.status(500).send('Error showing new key page')
  }
}
