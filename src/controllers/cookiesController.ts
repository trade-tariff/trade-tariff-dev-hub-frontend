import { type Request, type Response } from 'express'

export const cookiesPage = (req: Request, res: Response): void => {
  res.render('cookies')
}
