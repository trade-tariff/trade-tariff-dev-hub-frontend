import { type Request, type Response } from 'express'

export const returnURLPage = (req: Request, res: Response): void => {
  res.redirect('/dashboard')
}
