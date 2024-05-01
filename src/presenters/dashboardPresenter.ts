// Limitations with the nunjucks library and how the rows are created plus the ternary conditionals is why HTML is being built here.

import { type ApiKey } from '../../src/services/apiService'

export namespace DashboardPresenter {
  export function statusButton (text: string): string {
    return `<button class="govuk-button govuk-button--secondary" type="button">${text}</button>`
  }

  export function createDeleteForm (fpoId: string, CustomerKeyId: string): string {
    return `
            <form action="/keys/${fpoId}/${CustomerKeyId}/delete" method="post">
                <button type="submit" class="govuk-button govuk-button--warning">Revoke</button>
            </form>
        `
  }

  export function maskString (input: string): string {
    const visibleLength = 4

    if (input.length <= visibleLength) {
      return input
    }

    const lastFour = input.slice(-visibleLength)
    const maskedPart = 'x'.repeat(visibleLength)

    return maskedPart + lastFour
  }

  export function formatDate (dateInput: Date | string): string {
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

  export function present (apiKeys: ApiKey[], fpoId: string): any {
    const rows = apiKeys.map(key => {
      const status = key.Enabled ? 'Active' : 'Inactive'
      const deleteButton = DashboardPresenter.createDeleteForm(fpoId, key.CustomerApiKeyId)
      const updateButton: string = DashboardPresenter.statusButton(status)

      return [
        { text: DashboardPresenter.maskString(key.ApiGatewayId) },
        { text: key.Description },
        { text: DashboardPresenter.formatDate(key.CreatedAt) },
        { html: updateButton },
        { html: deleteButton }
      ]
    })
    return {
      rows
    }
  }
}
