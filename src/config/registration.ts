import { type NextFunction, type Request, type Response } from 'express'
import { CommonService } from '../services/commonService'
import { UserService } from '../services/userService'
import { logger } from '../config/logging'

export default async function (req: Request, res: Response, next: NextFunction): Promise<void> {
  const user = CommonService.handleRequest(req)
  const scpUser = { userId: user.userId, groupId: user.groupId }
  const userInfo = await UserService.getUser(scpUser)

  logger.debug(`User info: ${JSON.stringify(userInfo)}`)
  logger.debug(`User info status: ${userInfo.Status}`)
  try {
    switch (userInfo.Status) {
      case 'Authorised':
        logger.debug('User is authorised')
        next()
        break
      case 'Pending':
        logger.debug('User is pending')
        res.render('completion')
        break
      case 'Rejected':
        logger.debug('User is rejected')
        res.render('rejectedPage')
        break
      case 'Unregistered':
        logger.debug('User is unregistered')
        res.render('verification')
        break
      default:
        logger.debug(`User status not recognised ${userInfo.Status}`)
        await UserService.createUser(scpUser)
        res.render('verification')
    }
  } catch (error) {
    logger.error('Error in the registration flow:', error)
  }
}