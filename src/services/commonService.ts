export interface ScpUser {
  groupId: string
  userId: string
}

export namespace CommonService {

  export async function handleRequest (req: any): Promise<ScpUser> {
    const env = process.env.NODE_ENV ?? 'development'
    const userProfile = req.appSession?.userProfile ?? null

    if (userProfile === null) {
      if (env === 'production') throw new Error('User not authenticated')

      return {
        userId: 'local-development',
        groupId: 'local-development'
      }
    }

    if (req.oidc.isAuthenticated() === false) if (env === 'production') throw new Error('User not authenticated')

    const userId = userProfile.sub ?? ''
    const groupId = userProfile['bas:groupId'] ?? ''

    if (userId === '') throw new Error('User sub not set')
    if (groupId === '') throw new Error('User bas:groupId not set')

    return { userId, groupId }
  }
}
