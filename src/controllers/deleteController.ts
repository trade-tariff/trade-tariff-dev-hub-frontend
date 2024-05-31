import { type Request, type Response } from 'express'
import { ApiService } from '../services/apiService'
import { logger } from '../config/logging'
import { DashboardPresenter } from '../presenters/dashboardPresenter'

export const showDeleteKey = async (req: Request, res: Response): Promise<void> => {
  const user = await ApiService.handleRequest(req)
  const customerKeyId = req.params.customerKeyId
  const apiKey = await ApiService.getKey(user, customerKeyId)
  const createdAt = DashboardPresenter.formatDate(apiKey.CreatedAt, true)

  try {
    res.render('delete', { apiKey, createdAt })
  } catch (error) {
    logger.error('Error fetching API key details:', error)
    res.status(500).send('Error fetching API key details')
  }
}

export const deleteKey = async (req: Request, res: Response): Promise<void> => {
  const user = await ApiService.handleRequest(req)
  const customerKeyId = req.params.customerKeyId
  const organisationId = user.groupId

  try {
    await ApiService.deleteAPIKey(user, customerKeyId)
    res.redirect('/dashboard/' + organisationId)
  } catch (error) {
    logger.error('Error revoking API key:', error)
    res.status(500).send('Error revoking API key')
  }
}
