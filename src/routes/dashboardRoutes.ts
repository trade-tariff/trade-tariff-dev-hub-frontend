import { showDashboard, showRevokePage, revokeAPIKey, showCreatePage, showSuccessPage} from '../controllers/dashboardController';

const router: Router = express.Router()

router.get('/dashboard/:fpoId', showDashboard);
router.get('/keys/:fpoId/:customerKeyId/revoke', showRevokePage);
router.get('/keys/:fpoId/create', showCreatePage);
router.post('/keys/success', showSuccessPage);
router.post('/keys/:fpoId/:customerKeyId/revoke', revokeAPIKey);

export default router
