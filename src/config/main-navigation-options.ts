import {type NextFunction, type Request, type Response } from 'express'
import { RequestContext } from 'express-openid-connect'

export default function (req: any, res: Response, next: NextFunction): void {
  const mainNavigation: any = []

  if (<Request>req.oidc?.isAuthenticated()) {
    mainNavigation.push({
      href: '/dashboard',
      text: 'Dashboard'
    })

    const userProfile = <RequestContext>req.appSession?.userProfile ?? null
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
