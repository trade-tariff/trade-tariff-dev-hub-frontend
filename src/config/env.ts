import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

export default function initEnvironment (): void {
  let envFilePath: string

  switch (process.env.NODE_ENV) {
    case 'production':
      envFilePath = path.join(process.cwd(), '.env')
      break
    case 'test':
      envFilePath = path.join(process.cwd(), '.env.test')
      break
    default:
      envFilePath = path.join(process.cwd(), '.env.development')
  }

  if (fs.existsSync(envFilePath)) {
    dotenv.config({ path: envFilePath })
  } else {
    console.warn(`Environment file not found: ${envFilePath}`)
  }
}
