import { type ApiKey } from '../../src/services/apiService'
import { DashboardPresenter } from '../../src/presenters/dashboardPresenter'

describe('DashboardPresenter', () => {
  describe('present', () => {
    it('should present API keys as rows with necessary data and buttons', () => {
      const apiKeys: ApiKey[] = [
        {
          CustomerApiKeyId: 'foo',
          ApiGatewayId: 'bar',
          UsagePlanId: 'baz',
          Secret: 'qux',
          Enabled: true,
          Description: 'quux',
          FpoId: '123',
          CreatedAt: '2024-04-10T16:11:45.714Z',
          UpdatedAt: '2024-04-10T16:11:45.715Z'
        }
      ]

      const result = DashboardPresenter.present(apiKeys, 'fpoId')
      expect(result.rows.length).toBe(1)
      expect(result.rows[0]).toEqual(jasmine.any(Array))
      expect(result.rows[0][3].html).toContain('Active')
    })
  })
})
