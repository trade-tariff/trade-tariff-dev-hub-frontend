import { type Request, type Response } from 'express'

export const rejectedPage = async (req: Request, res: Response): Promise<void> => {
  res.render('rejectedPage')
}
