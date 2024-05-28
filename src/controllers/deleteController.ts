import { type Request, type Response } from 'express'
import { ApiService } from '../services/apiService'
import { logger } from '../config/logging'

export const showDeleteKey = async (req: Request, res: Response): Promise<void> => {
  const customerKeyId = req.params.customerKeyId
  const organisationId = req.params.organisationId
  const apiKey = await ApiService.getKey(organisationId, customerKeyId)

  try {
    res.render('delete', { apiKey })
  } catch (error) {
    logger.error('Error fetching API key details:', error)
    res.status(500).send('Error fetching API key details')
  }
}

export const deleteKey = async (req: Request, res: Response): Promise<void> => {
  const customerKeyId = req.params.customerKeyId
  const organisationId = req.params.organisationId
  console.log('deleteKey', organisationId, customerKeyId)

  try {
    await ApiService.deleteAPIKey(organisationId, customerKeyId)
    res.redirect('/dashboard/' + organisationId)
  } catch (error) {
    logger.error('Error revoking API key:', error)
    res.status(500).send('Error revoking API key')
  }
}
