import { type Request, type Response } from 'express'
import fs from 'fs'
import path from 'path'

async function getSha (): Promise<string> {
  return await new Promise((resolve) => {
    fs.readFile(
      path.join(__dirname, '..', '..', '..', 'REVISION'),
      'utf8',
      (err, data) => {
        if (err != null) {
          resolve('development')
        } else {
          resolve(data.trim())
        }
      })
  })
}

export class HealthchecksController {
  public async show (_req: Request, res: Response): Promise<void> {
    const revision = await getSha()
    res.status(200).json({ git_sha1: revision })
  }

  public async showz (_req: Request, res: Response): Promise<void> {
    const revision = await getSha()
    res.status(200).json({ git_sha1: revision })
  }
}
