import { type Request, type Response } from 'express'
import { ApiService } from '../services/apiService'
import { CommonService } from '../services/commonService'
import { DashboardPresenter } from '../presenters/dashboardPresenter'
import { logger } from '../config/logging'

export const showDashboard = async (req: Request, res: Response): Promise<void> => {
  const user = await CommonService.handleRequest(req)

  try {
    const apiKeys = await ApiService.listKeys(user)
    const formattedData = DashboardPresenter.present(apiKeys)

    res.render('dashboard', { formattedData })
  } catch (error) {
    logger.error('Error fetching API keys:', error)
    res.status(500).send('Error fetching API keys')
  }
}
