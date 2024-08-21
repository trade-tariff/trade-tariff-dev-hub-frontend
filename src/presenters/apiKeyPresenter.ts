export namespace ApiKeyPresenter {
  export function secretHtml (secret: string): any {
    return `<strong>API Key</strong> <br><code class="govuk-code" id="api-key">${secret}</code>`
  }
}
