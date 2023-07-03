import { Router } from 'express';
import authController from '../controllers/auth.controller.js';
import storeController from '../controllers/store.controller.js';
import eUserRole from '../utilities/enums/e.user-role.js';
import productRouter from './product.routes.js';

const router = Router();

// POST /store/234fad4/products
// GET /store/234fad4/products
router.use('/:storeId/products', productRouter);

router.get('/count', storeController.getStoresCount);

router
  .route('/')
  .get(storeController.getAllStores)
  .post(
    authController.protect,
    authController.restrictTo(eUserRole.USER),
    storeController.setStoreUser,
    storeController.createStore
  );

router
  .route('/:id')
  .get(storeController.getStore)
  .patch(
    authController.protect,
    authController.restrictTo(eUserRole.USER),
    storeController.uploadStoreLogo,
    storeController.resizeStoreLogo,
    storeController.updateStore
  )
  .delete(authController.protect, storeController.deleteStore);

export default router;
