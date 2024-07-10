/* eslint-disable @typescript-eslint/no-redeclare */

import { logger } from '../config/logging'
import { NotifyClient } from 'notifications-node-client'
import { type Organisation } from './organisationService'

const govUKNotifyAPIKey = process.env.GOVUK_NOTIFY_API_KEY ?? ''

type NotifyClient = typeof NotifyClient
const notifyClient: NotifyClient = new NotifyClient(govUKNotifyAPIKey)

interface EmailAddress {
  Email: string
  ScpEmail: string
}
export interface EmailData {
  organisation: Organisation
  userEmail: EmailAddress
}

export const sendSupportEmail = async (emailData: EmailData): Promise<void> => {
  const applicationTemplateId: string = process.env.SUPPORT_TEMPLATE_ID ?? ''
  const applicationSupporteEmail: string = process.env.APPLICATION_SUPPORT_EMAIL ?? ''
  try {
    await notifyClient.sendEmail(
      applicationTemplateId,
      applicationSupporteEmail,
      {
        personalisation: {
          organisation: emailData.organisation.OrganisationName,
          reference: emailData.organisation.ApplicationReference,
          eori: emailData.organisation.EoriNumber,
          ukc: emailData.organisation.UkAcsReference,
          email: emailData.userEmail.Email,
          scp_email: emailData.userEmail.ScpEmail
        },
        reference: emailData.organisation.ApplicationReference
      }
    )
  } catch (error: unknown) {
    logger.error('Error sending support email :', error)
  }
}

export const sendCustomerEmail = async (emailData: EmailData): Promise<void> => {
  const templateId: string = process.env.REGISTRATION_TEMPLATE_ID ?? ''
  try {
    await notifyClient.sendEmail(
      templateId,
      emailData.userEmail.Email,
      {
        personalisation: {
          reference: emailData.organisation.ApplicationReference
        },
        reference: emailData.organisation.ApplicationReference
      }
    )
  } catch (error: unknown) {
    logger.error('Error sending customer email :', error)
  }
}
