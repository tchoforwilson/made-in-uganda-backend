import { Router } from 'express';

import authController from '../controllers/auth.controller.js';

const router = Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/updateMyPassword', authController.updatePassword);

// PROTECT ALL ROUTE
router.use(authController.protect);

export default router;
