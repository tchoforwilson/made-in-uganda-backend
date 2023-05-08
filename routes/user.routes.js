import { Router } from 'express';

import authController from '../controllers/auth.controller.js';

const router = Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

// PROTECT ALL ROUTE AFTER THIS MIDDLEWARE
router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);

export default router;
