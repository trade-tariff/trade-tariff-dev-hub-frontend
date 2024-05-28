// Limitations with the nunjucks library and how the rows are created plus the ternary conditionals is why HTML is being built here.

import { type ApiKey } from '../../src/services/apiService'

const deletionEnabled = (process.env.DELETION_ENABLED ?? 'false') === 'true'

export namespace DashboardPresenter {
  export function present (apiKeys: ApiKey[], organisationId: string): any {
    const headers = [
      { text: 'API Client ID' },
      { text: 'Description' },
      { text: 'Created on' },
      { text: 'Status' },
      { text: 'Revoke' }
    ]
    const rows = apiKeys.map(key => {
      const status = key.Enabled ? 'Active' : `Revoked on ${formatDate(key.UpdatedAt)}`
      const revokeButton = key.Enabled ? createRevokeLink(organisationId, key.CustomerApiKeyId) : ''
      const deleteButton = deletionEnabled ? createDeleteLink(organisationId, key.CustomerApiKeyId) : ''

      return [
        { text: maskString(key.Secret) },
        { text: key.Description },
        { text: formatDate(key.CreatedAt) },
        { html: status },
        { html: revokeButton + deleteButton }
      ]
    })

    return { headers, rows }
  }

  function createRevokeLink (organisationId: string, customerKeyId: string): string {
    return `
        <p class="govuk-body">
          <a class="govuk-link govuk-link--no-visited-state" href="/dashboard/keys/${organisationId}/${customerKeyId}/revoke">Revoke</a>
        </p>
        `
  }

  function createDeleteLink (organisationId: string, customerKeyId: string): string {
    return `
        <p class="govuk-body">
          <a class="govuk-link govuk-link--no-visited-state" href="/dashboard/keys/${organisationId}/${customerKeyId}/delete">Delete</a>
        </p>
        `
  }

  function maskString (input: string): string {
    const visibleLength = 4

    if (input.length <= visibleLength) {
      return input
    }

    const lastFour = input.slice(-visibleLength)
    const maskedPart = 'x'.repeat(4)

    return maskedPart + lastFour
  }

  function formatDate (dateInput: Date | string): string {
    const date = new Date(dateInput)
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date')
    }
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }
}
