import { type Request, type Response } from 'express'

export const privacyPolicyPage = async (req: Request, res: Response): Promise<void> => {
  res.render('privacyPolicy')
}
