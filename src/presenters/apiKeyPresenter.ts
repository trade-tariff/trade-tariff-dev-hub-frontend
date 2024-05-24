export namespace ApiKeyPresenter {
  export function secretHtml (secret: string): any {
    return `Your API Key is <br><strong><code class="govuk-code">${secret}</code></strong>`
  }
}
