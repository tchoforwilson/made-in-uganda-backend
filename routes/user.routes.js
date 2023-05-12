import { Router } from 'express';

import authController from '../controllers/auth.controller.js';
import userController from '../controllers/user.controller.js';
import productRouter from './product.routes.js';
import subcriptionRouter from './subcription.routes.js';

const router = Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.post('/resetPassword/:token', authController.resetPassword);

// Merge param for shop products search
router.use('/:storeId/products', productRouter);
router.use('/:storeId/subcriptions', subcriptionRouter);

// PROTECT ALL ROUTE AFTER THIS MIDDLEWARE
router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);
router.get('/me', userController.getMe, userController.getUser);
router.patch(
  '/updateMe',
  userController.uploadStorePhoto,
  userController.resizeStorePhoto,
  userController.updateMe
);
router.patch('/deleteMe', userController.deleteMe);

// Restrict all route after this to admin
router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export default router;
