import { type Request, type Response } from 'express'
import { ApiService } from '../services/apiService'
import { DashboardPresenter } from '../presenters/dashboardPresenter'
import { logger } from '../config/logging'

export const showDashboard = async (req: Request, res: Response): Promise<void> => {
  const user = await ApiService.handleRequest(req)

  try {
    const apiKeys = await ApiService.listKeys(user)

    logger.debug(`API keys fetched successfully for FPO ID: ${user.groupId} with count: ${apiKeys.length}`)
    logger.debug(`API keys: ${JSON.stringify(apiKeys)}`)

    const formattedData = DashboardPresenter.present(apiKeys, user.groupId)
    res.render('dashboard', { formattedData, organisationId: user.groupId })
  } catch (error) {
    logger.error('Error fetching API keys:', error)
    res.status(500).send('Error fetching API keys')
  }
}
