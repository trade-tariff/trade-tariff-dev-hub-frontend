function validateCognitoConfig (): void {
  const authUrl = process.env.COGNITO_AUTH_URL ?? undefined
  const clientId = process.env.COGNITO_CLIENT_ID ?? undefined
  const clientSecret = process.env.COGNITO_CLIENT_SECRET ?? undefined

  if (authUrl === undefined) throw new Error('COGNITO_AUTH_URL undefined.')
  if (clientId === undefined) throw new Error('COGNITO_CLIENT_ID undefined.')
  if (clientSecret === undefined) throw new Error('COGNITO_CLIENT_SECRET undefined.')
}

export default validateCognitoConfig
