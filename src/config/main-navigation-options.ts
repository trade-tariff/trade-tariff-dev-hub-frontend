import { type NextFunction, type Request, type Response } from 'express'

export default function (req: Request, res: Response, next: NextFunction): void {
  const mainNavigation: any = []

  if (req.oidc?.isAuthenticated()) {
    mainNavigation.push({
      href: '/dashboard',
      text: 'Dashboard'
    })
    mainNavigation.push({
      href: '/profile',
      text: 'Update Profile'
    })
    mainNavigation.push({
      href: '/team',
      text: 'Manage Team'
    })
    mainNavigation.push({
      href: '/logout',
      text: 'Sign Out'
    })
  }

  res.locals.mainNavigation = mainNavigation

  next()
};
