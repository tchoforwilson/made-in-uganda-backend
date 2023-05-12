import { Router } from 'express';
import authController from '../controllers/auth.controller';
import subcriptionController from '../controllers/subcription.controller';

const router = Router({ mergeParams: true });

router.use(authController.protect);

router.use(authController.restrictTo('admin'));

router
  .route('/')
  .post(subcriptionController.createSubscription)
  .get(subcriptionController.getAllSubcriptions);

router
  .route('/:id')
  .get(subcriptionController.getSubcription)
  .patch(subcriptionController.updateSubcription)
  .delete(subcriptionController.deleteSubcription);

export default router;
