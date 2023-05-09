import { Router } from 'express';

import authController from '../controllers/auth.controller.js';
import userController from '../controllers/user.controller.js';

const router = Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.post('/resetPassword/:token', authController.resetPassword);

// PROTECT ALL ROUTE AFTER THIS MIDDLEWARE
router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);
router.patch('/updateMe', userController.updateMe);

export default router;
