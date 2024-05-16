// Limitations with the nunjucks library and how the rows are created plus the ternary conditionals is why HTML is being built here.

import { type ApiKey } from '../../src/services/apiService'

export namespace DashboardPresenter {
  export function present (apiKeys: ApiKey[], organisationId: string): any {
    const rows = apiKeys.map(key => {
      const status = key.Enabled ? 'Active' : `Revoked on ${formatDate(key.UpdatedAt)}`
      const deleteButton = key.Enabled ? createDeleteLink(fpoId, key.CustomerApiKeyId) : ''


      return {
        data: [
          { text: maskString(key.Secret) },
          { text: key.Description },
          { text: formatDate(key.CreatedAt) },
          { html: status },
          { html: deleteButton }
        ],
        createdAt: new Date(key.CreatedAt),
        lastUpdatedAt: new Date(key.UpdatedAt),
        status: key.Enabled
      }
    }).sort((a, b) => {
      if (a.createdAt.getTime() === b.createdAt.getTime()) {
        return a.lastUpdatedAt.getTime() - b.lastUpdatedAt.getTime()
      }
      return a.createdAt.getTime() - b.createdAt.getTime()
    }).map(item => item.data)

    return {
      rows
    }
  }

  function createDeleteForm (organisationId: string, customerKeyId: string): string {
    return `
        <p class="govuk-body">
          <a class="govuk-link govuk-link--no-visited-state" href="/dashboard/keys/${organisationId}/${customerKeyId}/revoke">Revoke</a>
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
