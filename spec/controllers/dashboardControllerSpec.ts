import { type Request, type Response } from 'express'
import { ApiService, type ApiKey } from '../../src/services/apiService'

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
        OrganisationId: 'local-development',
        CreatedAt: '2024-04-10T16:11:45.714Z',
        UpdatedAt: '2024-04-10T16:11:45.715Z'
      }
    ]
    spyOn(DashboardPresenter, 'present').and.returnValue({ headers: [], rows: [] })
    spyOn(ApiService, 'listKeys').and.returnValue(Promise.resolve(apiKeys))

    statusSpy = jasmine.createSpy().and.callFake(() => ({ send: sendSpy }))
    sendSpy = jasmine.createSpy()
    renderSpy = jasmine.createSpy()

    mockRequest = { params: { organisationId: 'local-development' } }
    mockResponse = {
      render: renderSpy,
      status: statusSpy,
      send: sendSpy
    }
  })

  it('should render the dashboard with formatted data from the presenter', async () => {
    await showDashboard(mockRequest as Request, mockResponse as Response)

    expect(ApiService.listKeys).toHaveBeenCalled()
    expect(DashboardPresenter.present).toHaveBeenCalledWith(jasmine.any(Array), 'local-development')
    expect(renderSpy).toHaveBeenCalledWith(
      'dashboard',
      {
        formattedData: {
          headers: [],
          rows: []
        },
        organisationId: 'local-development'
      }
    )
  })
})
