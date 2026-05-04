import { Router } from 'express';
import AdminController from '../controllers/admin.controller.js';
import { requireAdmin } from '../middleware/admin.js';

const router = Router();
router.use(requireAdmin);

router.get('/stats', AdminController.stats);
router.get('/users', AdminController.listUsers);
router.put('/users/:id', AdminController.updateUser);

export default router;