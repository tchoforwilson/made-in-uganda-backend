import { Router } from 'express';

import authController from '../controllers/auth.controller.js';
import productController from '../controllers/product.controller.js';

const router = Router({ mergeParams: true });

router
  .route('/')
  .get(productController.getAllProducts)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    productController.uploadProductImages,
    productController.resizeProductImages,
    productController.createProduct
  );

router
  .route('/:id')
  .get(productController.getProduct)
  .patch(
    authController.protect,
    authController.restrictTo('user'),
    productController.uploadProductImages,
    productController.resizeProductImages,
    productController.updateProduct
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'user'),
    productController.deleteProduct
  );

export default router;
