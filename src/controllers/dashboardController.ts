import { type Request, type Response } from 'express'
// import { ApiService } from '../services/apiService'
import { DashboardPresenter } from '../presenters/dashboardPresenter'
import { CustomerApiKeyFixtures } from '../fixtures/customerApiKeyfixtures'

// const apiServiceInstance = new ApiService()

export const showDashboard = async (req: Request, res: Response): Promise<void> => {
  const fpoId = req.params.fpoId
  try {
    const apiKeys = await ApiService.listKeys(fpoId)

    const formattedData = DashboardPresenter.present(apiKeys, fpoId)
    res.render('dashboard', { formattedData, fpoId })
  } catch (error) {
    console.error('Error fetching API keys:', error)
    res.status(500).send('Error fetching API keys')
  }
}

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
