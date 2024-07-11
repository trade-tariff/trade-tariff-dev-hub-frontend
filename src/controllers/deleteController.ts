import { type NextFunction, type Request, type Response } from 'express'
import { ApiService } from '../services/apiService'
import { CommonService } from '../services/commonService'
import { DashboardPresenter } from '../presenters/dashboardPresenter'

export const showDeleteKey = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = CommonService.handleRequest(req)
    const customerKeyId = req.params.customerKeyId
    const apiKey = await ApiService.getKey(user, customerKeyId)
    const createdAt = DashboardPresenter.formatDate(apiKey.CreatedAt, true)

    res.render('delete', { apiKey, createdAt, backLinkHref: '/dashboard' })
  } catch (error) {
    next(error)
  }
}

export const deleteKey = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = CommonService.handleRequest(req)
    const customerKeyId = req.params.customerKeyId

    await ApiService.deleteAPIKey(user, customerKeyId)
    res.redirect('/dashboard')
  } catch (error) {
    next(error)
  }
}
