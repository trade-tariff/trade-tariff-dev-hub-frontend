import { type NextFunction, type Response } from 'express'

export default function (req: any, res: Response, next: NextFunction): void {
  const mainNavigation: any = []

  if (req.oidc?.isAuthenticated()) {
    mainNavigation.push({
      href: '/dashboard',
      text: 'Dashboard'
    })

    const userProfile = req.appSession?.userProfile ?? null
    console.log('UserProfileFound:', userProfile)

    mainNavigation.push({
      href: '/userProfile',
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
