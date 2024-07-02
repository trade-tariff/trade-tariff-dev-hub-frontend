/* eslint-disable @typescript-eslint/no-redeclare */

import { logger } from '../config/logging'
import { NotifyClient } from 'notifications-node-client'

const govUKNotifyAPIKey = process.env.GOVUK_NOTIFY_API_KEY ?? ''

type NotifyClient = typeof NotifyClient
const notifyClient: NotifyClient = new NotifyClient(govUKNotifyAPIKey)

export namespace EmailService {
  export async function sendEmail (templateId: string, emailAddress: string, organisationName: string, ref: string, eoriNumber?: string, ukcReference?: string): Promise<void> {
    try {
      await notifyClient.sendEmail(
        templateId,
        emailAddress,
        {
          personalisation: {
            organisation: organisationName,
            reference: ref,
            eori: eoriNumber,
            ukc: ref
          },
          reference: ref
        }
      )
    } catch (error: unknown) {
      logger.error('Error sending email :', error)
    }
  }
}
