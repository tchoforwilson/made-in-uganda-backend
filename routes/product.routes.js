import { Router } from 'express';

import authController from '../controllers/auth.controller.js';
import productController from '../controllers/product.controller.js';
import eUserRole from '../utilities/enums/e.user-role.js';

const router = Router({ mergeParams: true });

router.route('/count').get(productController.getProductCount);
router.route('/distinct').get(productController.getDistinctProducts);
router
  .route('/myStore-productCount')
  .get(
    authController.protect,
    authController.restrictTo(eUserRole.USER),
    productController.setStoreParam,
    productController.getProductCount
  );
router
  .route('/top-products')
  .get(productController.aliasTopProducts, productController.getAllProducts);
router
  .route('/my-products')
  .get(
    authController.protect,
    authController.restrictTo(eUserRole.USER),
    productController.setStoreParam,
    productController.getAllProducts
  );

router
  .route('/')
  .get(productController.getAllProducts)
  .post(
    authController.protect,
    authController.restrictTo(eUserRole.USER),
    productController.uploadProductImages,
    productController.resizeProductImages,
    productController.setProductStore,
    productController.createProduct
  );

router
  .route('/:id')
  .get(productController.getProduct)
  .patch(
    authController.protect,
    authController.restrictTo(eUserRole.USER),
    productController.uploadProductImages,
    productController.resizeProductImages,
    productController.updateProduct
  )
  .delete(
    authController.protect,
    authController.restrictTo(eUserRole.ADMIN, eUserRole.USER),
    productController.deleteProduct
  );

export default router;
