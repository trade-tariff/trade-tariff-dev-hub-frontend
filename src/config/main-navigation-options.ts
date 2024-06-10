import {type NextFunction, type Request, type Response } from 'express'
import {type RequestContext } from 'express-openid-connect'

export default function (req: any, res: Response, next: NextFunction): void {
  const mainNavigation: any = []

  req as Request
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
