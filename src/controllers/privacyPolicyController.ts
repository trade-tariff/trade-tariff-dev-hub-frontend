import { type Request, type Response } from 'express'

export const privacyPolicyPage = (req: Request, res: Response): void => {
  res.render('privacyPolicy')
}
