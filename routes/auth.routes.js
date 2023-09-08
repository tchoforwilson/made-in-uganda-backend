import { Router } from 'express';
import authController from '../controllers/auth.controller.js';

const router = Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.post('/resetPassword/:token', authController.resetPassword);

// Protect this authentication routes
router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);

export default router;
