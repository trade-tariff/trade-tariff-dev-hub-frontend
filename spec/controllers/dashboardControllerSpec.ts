import { type Request, type Response } from 'express'
import { CustomerApiKeyFixtures } from '../../src/fixtures/customerApiKeyfixtures'
import { type ApiKey } from '../../src/services/apiService'

import { showDashboard } from '../../src/controllers/dashboardController'
import { DashboardPresenter } from '../../src/presenters/dashboardPresenter'

describe('DashboardController', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let statusSpy: jasmine.Spy
  let sendSpy: jasmine.Spy
  let renderSpy: jasmine.Spy

  beforeEach(() => {
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
    spyOn(DashboardPresenter, 'present').and.returnValue({ formattedData: 'data' })
    spyOn(CustomerApiKeyFixtures, 'getDummyKeys').and.returnValue(apiKeys)

    statusSpy = jasmine.createSpy().and.callFake(() => ({ send: sendSpy }))
    sendSpy = jasmine.createSpy()
    renderSpy = jasmine.createSpy()

    mockRequest = { params: { fpoId: '123' } }
    mockResponse = {
      render: renderSpy,
      status: statusSpy,
      send: sendSpy
    }
  })

  it('should render the dashboard with formatted data from the presenter', async () => {
    await showDashboard(mockRequest as Request, mockResponse as Response)

    expect(CustomerApiKeyFixtures.getDummyKeys).toHaveBeenCalled()
    expect(DashboardPresenter.present).toHaveBeenCalledWith(jasmine.any(Array), '123')
    expect(renderSpy).toHaveBeenCalledWith('dashboard', { formattedData: { formattedData: 'data' }, fpoId: '123' })
  })
})
