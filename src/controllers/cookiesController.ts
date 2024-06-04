import { type Request, type Response } from 'express'

export const cookiesPage = async (req: Request, res: Response): Promise<void> => {
  res.render('cookies')
}
