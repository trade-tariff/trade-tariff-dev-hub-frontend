// Limitations with the nunjucks library and how the rows are created plus the ternary conditionals is why HTML is being built here.

export class DashboardPresenter {
  private static createDeleteForm (fpoId: string, customerKeyId: string): string {
    return `
        <form action="/keys/${fpoId}/${customerKeyId}/revoke" method="get">
        <button type="submit" class="govuk-button govuk-button--warning">Revoke</button>
        </form>
        `
  }

  private static maskString (input: string): string {
    const visibleLength = 4

    if (input.length <= visibleLength) {
      return input
    }

    const lastFour = input.slice(-visibleLength)
    const maskedPart = 'x'.repeat(4)

    return maskedPart + lastFour
  }

  private static formatDate (dateInput: Date | string): string {
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

  public static present (apiKeys: any[], fpoId: string): any {
    console.log(apiKeys)
    const rows = apiKeys.map(key => {
      const status = key.Enabled ? 'Active' : `Revoked on ${DashboardPresenter.formatDate(key.UpdatedAt)}`
      const deleteButton = DashboardPresenter.createDeleteForm(fpoId, key.CustomerApiKeyId)

      return {
        data: [
          { text: DashboardPresenter.maskString(key.ApiGatewayId) },
          { text: key.Description },
          { text: DashboardPresenter.formatDate(key.CreatedAt) },
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
}
