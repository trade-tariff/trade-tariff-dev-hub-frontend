import { type NextFunction, type Request, type Response } from 'express'
import { ApiService } from '../services/apiService'
import { CommonService } from '../services/commonService'
import { ApiKeyPresenter } from '../presenters/apiKeyPresenter'
import { validationResult } from 'express-validator'

export const newKey = (_req: Request, res: Response): void => {
  res.render('newKey', { backLinkHref: '/dashboard' })
}

export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const apiKeyDescription = req.body.apiKeyDescription as string

    // Extract the validation errors from a request.
    const result = validationResult(req)
    if (result.isEmpty()) {
      const user = CommonService.handleRequest(req)
      const apiKey = await ApiService.createAPIKey(user, apiKeyDescription)
      const secretHtml = ApiKeyPresenter.secretHtml(apiKey.Secret)
      res.render('keySuccessPage', { secretHtml })
    } else {
      res.render('newKey', { error: result })
    }
  } catch (error) {
    next(error)
  }
}
