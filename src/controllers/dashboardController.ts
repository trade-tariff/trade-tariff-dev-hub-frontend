import { NextFunction, type Request, type Response } from 'express'
import { ApiService } from '../services/apiService'
import { CommonService } from '../services/commonService'
import { DashboardPresenter } from '../presenters/dashboardPresenter'
import { logger } from '../config/logging'

export const showDashboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = CommonService.handleRequest(req)

    const apiKeys = await ApiService.listKeys(user)
    const formattedData = DashboardPresenter.present(apiKeys)

    res.render('dashboard', { formattedData })
  } catch (error) {
    next(error)
  }
}
