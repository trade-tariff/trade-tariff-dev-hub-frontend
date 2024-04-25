import { DashboardPresenter } from '../../src/presenters/dashboardPresenter';

describe('DashboardPresenter', () => {
    describe('present', () => {
        it('should present API keys as rows with necessary data and buttons', () => {
            const apiKeys = [
                { ApiGatewayId: 'abc123def456',
                  CustomerApiKeyId: 'key1',
                  Description: 'Key 1',
                  CreatedAt: '2023-01-01',
                  Enabled: true }
            ];
            const result = DashboardPresenter.present(apiKeys, '123');
            expect(result.rows.length).toBe(1);
            expect(result.rows[0]).toEqual(jasmine.any(Array));
            expect(result.rows[0][3].html).toContain('Active');
        });
    });
});
