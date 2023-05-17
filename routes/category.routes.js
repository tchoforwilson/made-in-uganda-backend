import { Router } from 'express';
import authController from '../controllers/auth.controller.js';
import categoryController from '../controllers/category.controller.js';

const router = Router();

router
  .route('/')
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    categoryController.createCategory
  )
  .get(categoryController.getAllCategories);

router
  .route('/:id')
  .get(categoryController.updateCategory)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    categoryController.updateCategory
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    categoryController.deleteCategory
  );

export default router;
