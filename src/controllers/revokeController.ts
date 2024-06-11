import { type Request, type Response } from 'express'
import { ApiService } from '../services/apiService'
import { CommonService } from '../services/commonService'
import { logger } from '../config/logging'
import { DashboardPresenter } from '../presenters/dashboardPresenter'

export const showRevoke = async (req: Request, res: Response): Promise<void> => {
  const user = await CommonService.handleRequest(req)
  const customerKeyId = req.params.customerKeyId
  const apiKey = await ApiService.getKey(user, customerKeyId)
  const createdAt = DashboardPresenter.formatDate(apiKey.CreatedAt, true)

  try {
    res.render('revoke', { apiKey, createdAt })
  } catch (error) {
    logger.error('Error fetching API key details:', error)
    res.status(500).send('Error fetching API key details')
  }
}

export const revoke = async (req: Request, res: Response): Promise<void> => {
  const user = await CommonService.handleRequest(req)
  const customerKeyId = req.params.customerKeyId
  const enabled = req.params.enabled

  try {
    await ApiService.revokeAPIKey(
      user,
      customerKeyId,
      enabled === 'true'
    )

    res.redirect('/dashboard')
  } catch (error) {
    logger.error('Error revoking API key:', error)
    res.status(500).send('Error revoking API key')
  }
}
