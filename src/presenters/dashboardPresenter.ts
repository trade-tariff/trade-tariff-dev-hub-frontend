// Limitations with the nunjucks library and how the rows are created plus the ternary conditionals is why HTML is being built here.

import { type ApiKey } from '../../src/services/apiService'

const deletionEnabled = (process.env.DELETION_ENABLED ?? 'false') === 'true'

interface DashboardTable {
  headers: Array<{ text: string }>
  rows: Array<Array<{ text?: string, html?: string }>>
}

export namespace DashboardPresenter {
  export function present (apiKeys: ApiKey[]): DashboardTable {
    const headers = [
      { text: 'API Key' },
      { text: 'Description' },
      { text: 'Created on' },
      { text: 'Status' },
      { text: '' }
    ]
    const rows = apiKeys.map(key => {
      const shouldDelete = !key.Enabled && deletionEnabled
      const status = key.Enabled ? 'Active' : `Revoked on ${formatDate(key.UpdatedAt, false)}`
      const revokeButton = key.Enabled ? createRevokeLink(key.CustomerApiKeyId) : ''
      const deleteButton = shouldDelete ? createDeleteLink(key.CustomerApiKeyId) : ''

      return [
        { text: key.Secret },
        { text: key.Description },
        { text: formatDate(key.CreatedAt, true) },
        { html: status },
        { html: revokeButton + deleteButton }
      ]
    })

    return { headers, rows }
  }

  function createRevokeLink (customerKeyId: string): string {
    return `
        <p class="govuk-body">
          <a class="govuk-link govuk-link--no-visited-state" href="/dashboard/${customerKeyId}/revoke">Revoke</a>
        </p>
        `
  }

  function createDeleteLink (customerKeyId: string): string {
    return `
        <p class="govuk-body">
          <a class="govuk-link govuk-link--no-visited-state" href="/dashboard/${customerKeyId}/delete">Delete</a>
        </p>
        `
  }

  export function formatDate (dateInput: Date | string, useToday: boolean = false): string {
    const date = new Date(dateInput)

    if (useToday && isToday(date)) return 'Today'

    if (isNaN(date.getTime())) {
      throw new Error('Invalid date')
    }
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  function isToday (date: Date): boolean {
    const today = new Date()
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
  }
}
