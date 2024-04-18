import { Request, Response } from 'express';
import { ApiService } from '../services/apiService'
import { DashboardPresenter } from '../presenters/dashboardPresenter'
import { CustomerApiKeyFixtures } from '../fixtures/customerApiKeyfixtures';

const apiServiceInstance = new ApiService();

export const showDashboard = async (req: Request, res: Response): Promise<void> => {
    const fpoId = req.params.fpoId;
    try {
        // Assuming you want to use real data, you would uncomment the next line:
        // const apiKeys = await ApiService.listKeys(fpoId);
        const apiKeys = CustomerApiKeyFixtures.getDummyKeys();

        const formattedData = DashboardPresenter.present(apiKeys, fpoId);
        res.render('dashboard', { formattedData, fpoId });
    } catch (error) {
        console.error('Error fetching API keys:', error);
        res.status(500).send("Error fetching API keys");
    }
};
