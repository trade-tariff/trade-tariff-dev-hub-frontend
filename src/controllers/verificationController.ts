import { type Request, type Response } from 'express'
import { type Result, type ValidationError, type FieldValidationError } from 'express-validator'
import { logger } from '../config/logging'
import { validationResult } from 'express-validator'

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

export const checkVerificationDetails = async (req: Request, res: Response): Promise<void> => {
  const body = req.body
  const session = req.session ?? {}
  session.organisationName = body.organisationName ?? ''
  session.eoriNumber = body.eoriNumber ?? ''
  session.ukacsReference = body.ukacsReference ?? ''
  session.emailAddress = body.emailAddress ?? ''
  const inputValidationResult: Result<ValidationError> = validationResult(req)
  const errorList = []
  try {
    const eoriNumberError = inputValidationResult.array({ onlyFirstError: true }).find((error) => (error as FieldValidationError).path === 'eoriNumber')
    if (eoriNumberError == null) {
      const eoriValidationResult: EoriCheckResult[] = await getEoriValidationResult(body.eoriNumber as string)

      if (!eoriValidationResult[0].valid) {
        errorList.push({
          text: 'Enter your Economic Operators Registration and Identification (EORI) number',
          href: '#eoriNumber'
        })
      }
    }
    if (inputValidationResult.isEmpty()) {
      res.render('checkVerification', { body, session })
    } else {
      const array = inputValidationResult.array({ onlyFirstError: true })
      for (let index = 0; index < array.length; index++) {
        const element: FieldValidationError = array[index] as FieldValidationError
        errorList.push({
          text: element.msg,
          href: '#' + element.path
        })
      }
      const organisationNameError = errorList.find((element) => element.href === '#organisationName')
      const eoriNumberError = errorList.find((element) => element.href === '#eoriNumber')
      const ukacsReferenceError = errorList.find((element) => element.href === '#ukacsReference')
      const emailAddressError = errorList.find((element) => element.href === '#emailAddress')
      res.render('verification', { body, session, errors: errorList, organisationNameError, eoriNumberError, ukacsReferenceError, emailAddressError })
    }
  } catch (error) {
    logger.error('Error checking verification details:', error)
    res.status(500).send('Error checking verification details')
  }
}

export const applicationComplete = async (req: Request, res: Response): Promise<void> => {
  const body = req.body
  const session = req.session ?? {}
  const result = validationResult(req)

  try {
    if (result.isEmpty()) {
      req.session = null
      res.render('completion')
    } else {
      res.render('checkVerification', { body, session, error: result })
    }
  } catch (error) {
    logger.error('Error completing the application:', error)
    res.status(500).send('Error completing the application')
  }
}
