import { type Request, type Response } from 'express'
import { ApiService } from '../services/apiService'

export const showRevokePage = async (req: Request, res: Response): Promise<void> => {
  const customerKeyId = req.params.customerKeyId
  const fpoId = req.params.fpoId

  try {
    res.render('revoke', { customerKeyId, fpoId })
  } catch (error) {
    console.error('Error fetching API key details:', error)
    res.status(500).send('Error fetching API key details')
  }
}

export const revokeAPIKey = async (req: Request, res: Response): Promise<void> => {
  const customerKeyId = req.params.customerKeyId
  const fpoId = req.params.fpoId
  const enabled = req.params.enabled

  try {
    await ApiService.revokeAPIKey(fpoId, customerKeyId, enabled === 'true')
    res.redirect('/dashboard/' + fpoId)
  } catch (error) {
    console.error('Error revoking API key:', error)
    res.status(500).send('Error revoking API key')
  }
}
