import { Router } from 'express';
import AdminController from '../controllers/admin.controller.js';
import { requireAdmin } from '../middleware/admin.js';

const router = Router();
router.use(requireAdmin);

router.get('/', AdminController.adminPanel);
router.post('/assign-cards/', AdminController.assignCards);
router.get('/assign-cards/:playerId', AdminController.assignCardsForm);

export default router;