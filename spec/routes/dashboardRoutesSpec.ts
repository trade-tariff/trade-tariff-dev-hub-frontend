// import request from 'supertest';
// import express from 'express';

// const dashboardController = require('../../src/controllers/dashboardController');
// const router = require('../../src/routes/dashboardRoutes');

// describe('Dashboard API Routes', () => {
//     let app: express.Express;

//     beforeEach(() => {
//         app = express();
//         app.use(express.json());
//         app.use('/', router);
//     });

    // describe('GET /dashboard/:fpoId', () => {
    //     it('should handle the route and call the appropriate controller method', async () => {
    //         spyOn(dashboardController, 'showDashboard').and.callThrough(); // Spy on the dashboardController.showDashboard method
    //         await request(app).get('/dashboard/123')
    //             .expect(200) // You can specify the expected HTTP status code
    //             .then(() => {
    //                 expect(dashboardController.showDashboard).toHaveBeenCalled(); // Ensure the controller method was called
    //             });
    //     });
    // });

    // describe('POST /keys/:fpoId/:id/update', () => {
    //     it('should handle the route and call the appropriate controller method', async () => {
    //         spyOn(dashboardController, 'updateApiKey').and.callThrough();
    //         await request(app).post('/keys/123/456/update')
    //             .send({ status: 'active' }) // Send any required body data
    //             .expect(200)
    //             .then(() => {
    //                 expect(dashboardController.updateApiKey).toHaveBeenCalled();
    //             });
    //     });
    // });
// });

