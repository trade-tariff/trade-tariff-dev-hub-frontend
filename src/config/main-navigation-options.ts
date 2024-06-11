import { type NextFunction, type Response } from 'express'

export default function (req: any, res: Response, next: NextFunction): void {
  const mainNavigation: any = []
  const isAuthenticated: boolean = req.oidc?.isAuthenticated() ?? false

  if (isAuthenticated) {
    mainNavigation.push({
      href: '/dashboard',
      text: 'Dashboard'
    })

    const userProfile = req.appSession?.userProfile ?? {}
    const profileUrl = userProfile.profile ?? null
    const groupUrl = userProfile['bas:groupProfile'] ?? null

    mainNavigation.push({
      href: profileUrl,
      text: 'Update Profile'
    })
    mainNavigation.push({
      href: groupUrl,
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
