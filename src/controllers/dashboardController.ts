import { Request, Response } from 'express';
import { ApiService } from '../services/apiService'
import { DashboardPresenter } from '../presenters/dashboardPresenter'

export const showDashboard = async (req: Request, res: Response): Promise<void> => {
    const fpoId = req.params.fpoId;
    try {
        const apiKeys = await ApiService.listKeys(fpoId);

        const formattedData = DashboardPresenter.present(apiKeys, fpoId);
        res.render('dashboard', { formattedData, fpoId });
    } catch (error) {
        console.error('Error fetching API keys:', error);
        res.status(500).send("Error fetching API keys");
    }
};

export const showRevokePage = async (req: Request, res: Response): Promise<void> => {
    const customerKeyId = req.params.customerKeyId;
    const fpoId = req.params.fpoId;

    try {
        res.render('revoke', { customerKeyId, fpoId });
    } catch (error) {
        console.error('Error fetching API key details:', error);
        res.status(500).send("Error fetching API key details");
    }
};

export const showCreatePage = async (req: Request, res: Response): Promise<void> => {
    const fpoId = req.params.fpoId;

    try {
        res.render('newKey', { fpoId });
    } catch (error) {
        console.error('Error showing create page', error);
        res.status(500).send("Error showing new key page");
    }
};

export const showSuccessPage = async (req: Request, res: Response): Promise<void> => {
    const fpoId = req.params.fpoId;
    const apiKey = '646842';

    try {
        res.render('keySuccessPage', { apiKey: apiKey });
    } catch (error) {
        console.error('Error showing create page', error);
        res.status(500).send("Error showing new key page");
    }
};

export const revokeAPIKey = async (req: Request, res: Response): Promise<void> => {
    const customerKeyId = req.params.customerKeyId;
    const fpoId = req.params.fpoId;
    const enabled = req.params.enabled;

    try {
        await ApiService.revokeAPIKey(fpoId, customerKeyId, enabled === "true");
        res.redirect('/dashboard/' + fpoId);
    } catch (error) {
        console.error('Error revoking API key:', error);
        res.status(500).send("Error revoking API key");
    }
};

