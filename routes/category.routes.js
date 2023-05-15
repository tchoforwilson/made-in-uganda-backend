import { Router } from 'express';
import authController from '../controllers/auth.controller.js';
import categoryController from '../controllers/category.controller.js';

const router = Router();

router.use(authController.protect, authController.restrictTo('admin'));

router
  .route('/')
  .post(categoryController.createCategory)
  .get(categoryController.getAllCategories);

router
  .route('/:id')
  .get(categoryController.updateCategory)
  .patch(categoryController.getCategory)
  .delete(categoryController.deleteCategory);

export default router;
