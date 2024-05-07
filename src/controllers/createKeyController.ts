import { type Request, type Response } from 'express'
import { ApiService } from '../services/apiService'

export const showCreatePage = async (req: Request, res: Response): Promise<void> => {
  const fpoId = req.params.fpoId

  try {
    res.render('newKey', { fpoId })
  } catch (error) {
    console.error('Error showing create page', error)
    res.status(500).send('Error showing new key page')
  }
}

export const showSuccessPage = async (req: Request, res: Response): Promise<void> => {
  const fpoId = req.params.fpoId
  const apiKeyDescription = req.body;

  try {
    const apiKey = await ApiService.createAPIKey(fpoId, apiKeyDescription)

    console.log(apiKey)

    res.render('keySuccessPage', { apiKey })
  } catch (error) {
    console.error('Error showing create page', error)
    res.status(500).send('Error showing new key page')
  }
}
