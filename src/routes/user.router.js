import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import UserController from '../controllers/user.controller.js';

const router = Router();
router.use(requireAuth);

router.get('/profile', UserController.profile);
router.put('/profile', UserController.updateProfile);

export default router; //not in use yet