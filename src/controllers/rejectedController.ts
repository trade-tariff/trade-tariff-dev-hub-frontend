import { type Request, type Response } from 'express'

export const rejectedPage = (req: Request, res: Response): void => {
  res.render('rejectedPage')
}
