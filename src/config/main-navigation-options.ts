import { type NextFunction, type Response } from 'express'
import { logger } from './logging'

export default function (req: any, res: Response, next: NextFunction): void {
  const mainNavigation: any = []
  const isAuthenticated: boolean = req.oidc?.isAuthenticated() ?? false

  if (isAuthenticated) {
    mainNavigation.push({
      href: '/dashboard',
      text: 'Dashboard'
    })

    const userProfile = req.appSession?.userProfile ?? {}
    let profileUrl = userProfile.profile ?? null
    let groupUrl = userProfile['bas:groupProfile'] ?? null
    const baseUrl: string = req.app.get('baseURL') ?? ''

    if (profileUrl != null) {
      profileUrl = profileUrl + '?redirect_uri=' + encodeURIComponent(baseUrl + '/auth/profile-redirect')
    }

    if (groupUrl != null) {
      groupUrl = groupUrl + '?redirect_uri=' + encodeURIComponent(baseUrl + '/auth/group-redirect')
    }
    logger.debug(`scpConfigBaseURL: ${baseUrl} for userProfile: ${profileUrl} and groupUrl: ${groupUrl}`)

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
