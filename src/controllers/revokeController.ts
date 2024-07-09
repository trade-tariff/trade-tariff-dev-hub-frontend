import { NextFunction, type Request, type Response } from 'express'
import { ApiService } from '../services/apiService'
import { CommonService } from '../services/commonService'
import { logger } from '../config/logging'
import { DashboardPresenter } from '../presenters/dashboardPresenter'

export const showRevoke = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = CommonService.handleRequest(req)
    const customerKeyId = req.params.customerKeyId
    const apiKey = await ApiService.getKey(user, customerKeyId)
    const createdAt = DashboardPresenter.formatDate(apiKey.CreatedAt, true)

    res.render('revoke', { apiKey, createdAt })
  } catch (error) {
    next(error)
  }
}

export const revoke = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = CommonService.handleRequest(req)
    const customerKeyId = req.params.customerKeyId
    const enabled = req.params.enabled

    await ApiService.revokeAPIKey(
      user,
      customerKeyId,
      enabled === 'true'
    )

    res.redirect('/dashboard')
  } catch (error) {
    next(error)
  }
}
