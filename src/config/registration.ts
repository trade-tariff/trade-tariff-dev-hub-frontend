import { type NextFunction, type Request, type Response } from 'express'
import { CommonService } from '../services/commonService'
import { UserService } from '../services/userService'
import { OrganisationService } from '../services/organisationService'
import { logger } from '../config/logging'

export default async function (req: Request, res: Response, next: NextFunction): Promise<void> {
  const user = CommonService.handleRequest(req)
  const scpUser = { userId: user.userId, groupId: user.groupId, email: user.email }
  let userInfo = await UserService.getUser(scpUser)
  const organisation = await OrganisationService.getOrganisation(userInfo.OrganisationId)
  const applicationReference = organisation.ApplicationReference

  logger.debug(`User info: ${JSON.stringify(userInfo)}`)
  logger.debug(`User info status: ${userInfo.Status}`)
  logger.debug(`organisation info: ${JSON.stringify(organisation)}`)
  logger.debug(`organisationId : ${organisation.OrganisationId} applicationReference :${applicationReference}`)
  if (userInfo.Status === undefined) {
    await UserService.createUser(scpUser)
  }
  userInfo = await UserService.getUser(scpUser)
  logger.debug(`After create: User info status: ${userInfo.Status}`)
  try {
    switch (userInfo.Status) {
      case 'Authorised':
        logger.debug('User is authorised')
        next()
        break
      case 'Pending':
        logger.debug('User is pending')
        res.render('completion', { applicationReference })
        break
      case 'Rejected':
        logger.debug('User is rejected')
        res.render('rejectedPage', { applicationReference })
        break
      case 'Unregistered':
      default:
        logger.debug('User is unregistered')
        res.redirect('/verification')
        break
    }
  } catch (error) {
    logger.error('Error in the registration flow:', error)
    next(error)
  }
}
