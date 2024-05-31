import { type NextFunction, type Request, type Response } from 'express'

export default function (req: Request, res: Response, next: NextFunction): void {
  const mainNavigation: any = []

  if (req.oidc?.isAuthenticated()) {
    mainNavigation.push({
      href: '/logout',
      text: 'Sign Out'
    })
  }

  res.locals.mainNavigation = mainNavigation

  next()
};
