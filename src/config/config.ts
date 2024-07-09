const config = {
  urls: {
    termsAndConditions: process.env.TERMS_AND_CONDITIONS_URL ?? 'https://api.trade-tariff.service.gov.uk/fpo/terms-and-conditions.html',
    feedback: process.env.FEEDBACK_URL ?? 'https://www.trade-tariff.service.gov.uk/feedback',
    apiDocs: process.env.API_DOCS_URL ?? 'https://api.trade-tariff.service.gov.uk/fpo.html'
  }
}

export default config
