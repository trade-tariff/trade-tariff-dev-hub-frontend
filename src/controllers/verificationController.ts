import { type NextFunction, type Request, type Response } from 'express'
import { type Result, type ValidationError, type FieldValidationError } from 'express-validator'
import { randomBytes } from 'node:crypto'
import { logger } from '../config/logging'
import { validationResult } from 'express-validator'
import { type EmailData, sendCustomerEmail, sendSupportEmail } from '../services/emailService'
import { type Organisation, OrganisationService } from '../services/organisationService'
import { CommonService } from '../services/commonService'
import { UserService } from '../services/userService'

interface EoriCheckResult {
  eori: string
  valid: boolean
  processingDate: Date
}

async function getEoriValidationResult (eoriNumber: string): Promise<EoriCheckResult[]> {
  const url = process.env.EORI_LOOKUP_URL ?? ''

  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'User-Agent': 'hub-frontend'
  }
  const data = { eoris: [eoriNumber] }
  const options: RequestInit = {
    method: 'POST',
    body: JSON.stringify(data),
    headers
  }
  try {
    const response = await fetch(url, options)
    return await response.json()
  } catch (error) {
    logger.error('Error validating EORI number:', error)
    return [{
      eori: eoriNumber,
      valid: false,
      processingDate: new Date()
    }]
  }
}

export const newVerificationPage = async (req: Request, res: Response): Promise<void> => {
  const session = req.session ?? {}
  session.organisationName = session.organisationName ?? ''
  session.eoriNumber = session.eoriNumber ?? ''
  session.ukacsReference = session.ukacsReference ?? ''
  session.emailAddress = session.emailAddress ?? ''
  res.render('verification', { session })
}

export const checkVerificationDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const body = req.body
    const session = req.session ?? {}
    session.organisationName = body.organisationName ?? ''
    session.eoriNumber = body.eoriNumber ?? ''
    session.ukacsReference = body.ukacsReference ?? ''
    session.emailAddress = body.emailAddress ?? ''

    const inputValidationResult: Result<ValidationError> = validationResult(req)
    const errors = inputValidationResult
      .array({ onlyFirstError: true })
      .filter((error) => error.type === 'field')
      .map((error) => error as FieldValidationError)
      .reduce((prev, error) => { prev[error.path] = { text: error.msg, href: `#field-${error.path}` }; return prev }, {} as Record<string, GovUkErrorSummaryError>)

    if (errors.eoriNumber === undefined) {
      const eoriValidationResult: EoriCheckResult[] = await getEoriValidationResult(body.eoriNumber as string)

      if (!eoriValidationResult[0].valid) {
        errors.eoriNumber = {
          text: 'Enter a real EORI number',
          href: '#eoriNumber'
        }
      }
    }
    if (Object.keys(errors).length === 0) {
      res.render('checkVerification', { body, session })
    } else {
      res.render('verification', { body, session, errors, errorList: Object.values(errors) })
    }
  } catch (error) {
    next(error)
  }
}

export const applicationComplete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const body = req.body
  const session = req.session ?? {}
  const user = CommonService.handleRequest(req)
  const organisationId = user.groupId

  const inputValidationResult = validationResult(req)
  const errors = inputValidationResult
    .array({ onlyFirstError: true })
    .filter((error) => error.type === 'field')
    .map((error) => error as FieldValidationError)
    .reduce((prev, error) => { prev[error.path] = { text: error.msg, href: `#field-${error.path}` }; return prev }, {} as Record<string, GovUkErrorSummaryError>)

  try {
    if (Object.keys(errors).length === 0) {
      const env = process.env.NODE_ENV ?? 'development'
      const applicationReference: string = generateApplicationReference(8)
      const organisation = {
        OrganisationId: organisationId,
        ApplicationReference: applicationReference,
        OrganisationName: session.organisationName as string,
        UkAcsReference: session.ukacsReference as string,
        EoriNumber: session.eoriNumber as string,
        Status: '',
        CreatedAt: '',
        UpdatedAt: ''
      } satisfies Organisation
      await OrganisationService.updateOrganisation(organisation)
      await UserService.updateUser(user, session.emailAddress as string)
      if (env === 'production') {
        const emailData = {
          organisation,
          userEmail: {
            Email: session.emailAddress as string,
            ScpEmail: user.email
          }
        } satisfies EmailData
        await sendCustomerEmail(emailData)
        await sendSupportEmail(emailData)
      }
      req.session = null
      res.render('completion', { applicationReference })
    } else {
      res.render('checkVerification', { body, session, errors, errorList: Object.values(errors) })
    }
  } catch (error) {
    next(error)
  }
}
function generateApplicationReference (length: number): string {
  if (length % 2 !== 0) {
    length++
  }
  return randomBytes(length / 2).toString('hex').toUpperCase()
}
