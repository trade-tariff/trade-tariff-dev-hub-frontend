import express, { Router } from 'express';


const router: Router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/dashboard/:fpoId', dashboardController.showDashboard);

module.exports = router;
