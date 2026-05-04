import { Router } from 'express';
import AuthViewController from '../controllers/views/auth.controller.js';
import AuthController from '../controllers/auth.controller.js';

const router = Router();

// views
router.get('/login', AuthViewController.getLogin);
router.get('/register', AuthViewController.getRegister);

// 
router.post('/auth/login', AuthController.login);
router.post('/auth/register', AuthController.register);
router.post('/auth/logout', AuthController.logout);

export default router;

