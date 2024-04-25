import { Request, Response } from 'express';
import * as fixtures from '../../src/fixtures/customerApiKeyfixtures';
import { showDashboard } from '../../src/controllers/dashboardController';
import { ApiService } from '../../src/services/apiService';
import { DashboardPresenter } from '../../src/presenters/dashboardPresenter';

describe('DashboardController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let statusSpy: jasmine.Spy;
  let sendSpy: jasmine.Spy;
  let renderSpy: jasmine.Spy;

  beforeEach(() => {
    // Replace the method directly for the duration of the test
    spyOn(ApiService, 'listKeys').and.returnValue(Promise.resolve([{ key: 'key1', permissions: 'read' }]));
    spyOn(DashboardPresenter, 'present').and.returnValue({ formattedData: 'data' });
    spyOn(fixtures.CustomerApiKeyFixtures, 'getDummyKeys').and.returnValue([{ key: 'key1', permissions: 'read' }]);

    statusSpy = jasmine.createSpy().and.returnValue({ send: jasmine.createSpy() });
    sendSpy = jasmine.createSpy();
    renderSpy = jasmine.createSpy();

    mockRequest = { params: { fpoId: '123' } };
    mockResponse = {
      render: renderSpy,
      status: statusSpy,
      send: sendSpy
    };
  });

  it('should render the dashboard with formatted data', async () => {
    await showDashboard(mockRequest as Request, mockResponse as Response);

    expect(fixtures.CustomerApiKeyFixtures.getDummyKeys).toHaveBeenCalled();
    expect(DashboardPresenter.present).toHaveBeenCalledWith(jasmine.any(Array), '123');
    expect(renderSpy).toHaveBeenCalledWith('dashboard', { formattedData: { formattedData: 'data' }, fpoId: '123' });
  });

  // it('should handle errors when API keys cannot be fetched', async () => {
  //   (ApiService.listKeys as jasmine.Spy).and.returnValue(Promise.reject(new Error('Failed to fetch keys')));

  //   await showDashboard(mockRequest as Request, mockResponse as Response);

  //   expect(statusSpy).toHaveBeenCalledWith(500);
  //   expect(sendSpy).toHaveBeenCalled();
  // });
});
