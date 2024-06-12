import { type NextFunction, type Request, type Response } from 'express'
import { CommonService } from '../services/commonService'
import { UserService } from '../services/userService'
import { logger } from '../config/logging'

export default async function (req: Request, res: Response, next: NextFunction): Promise<void> {
  const user = CommonService.handleRequest(req)
  const scpUser = { userId: user.userId, groupId: user.groupId }
  const userInfo = await UserService.getUser(scpUser)

  try {
    switch (userInfo.Status) {
      case 'Authorised':
        res.render('dashboard')
        break
      case 'Pending':
        res.render('completion')
        break
      case 'Rejected':
        res.render('rejectedPage')
        break
      case 'Unregistered':
        res.render('verification')
        break
      default:
        await UserService.createUser(scpUser)
        res.render('verification')
    }
  } catch (error) {
    logger.error('Error in the registration flow:', error)
  }
}
