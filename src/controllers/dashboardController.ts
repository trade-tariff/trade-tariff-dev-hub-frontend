import { type Request, type Response } from 'express'
import { ApiService } from '../services/apiService'
import { DashboardPresenter } from '../presenters/dashboardPresenter'

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
