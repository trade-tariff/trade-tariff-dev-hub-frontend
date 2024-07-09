export interface ScpUser {
  groupId: string
  userId: string
  email: string
}

export interface ScpOrganisation {
  organisationId: string
}

export namespace CommonService {
  export function handleRequest (req: any): ScpUser {
    const env = process.env.NODE_ENV ?? 'development'
    const userProfile = req.appSession?.userProfile ?? null

    if (userProfile === null) {
      if (env === 'production') throw new Error('User not authenticated')

      return {
        userId: 'local-development',
        groupId: 'local-development',
        email: ''
      }
    }

    if (req.oidc.isAuthenticated() === false) if (env === 'production') throw new Error('User not authenticated')

    const userId = userProfile.sub ?? ''
    const groupId = userProfile['bas:groupId'] ?? ''
    const email = userProfile.email

    if (userId === '') throw new Error('User sub not set')
    if (groupId === '') throw new Error('User bas:groupId not set')
    if (email === '') throw new Error('Email not set')

    return { userId, groupId, email }
  }
}
