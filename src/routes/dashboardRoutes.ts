import express, { Router } from 'express';


const router: Router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/dashboard/:fpoId', dashboardController.showDashboard);
router.post('/keys/:fpoId/:id/update', dashboardController.updateApiKey);

module.exports = router;
