import { Router } from 'express';
import authController from '../controllers/auth.controller.js';
import subscriptionController from '../controllers/subscription.controller.js';
import eUserRole from '../utilities/enums/e.user-role.js';

const router = Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .post(
    authController.restrictTo(eUserRole.ADMIN, eUserRole.USER),
    subscriptionController.setSubscriptionUserId,
    subscriptionController.createSubscription
  )
  .get(
    authController.restrictTo(eUserRole.ADMIN),
    subscriptionController.getAllSubscriptions
  );

router
  .route('/:id')
  .get(
    authController.restrictTo(eUserRole.ADMIN, eUserRole.USER),
    subscriptionController.getSubscription
  )
  .patch(
    authController.restrictTo(eUserRole.ADMIN, eUserRole.USER),
    subscriptionController.updateSubscription
  )
  .delete(
    authController.restrictTo(eUserRole.ADMIN, eUserRole.USER),
    subscriptionController.deleteSubscription
  );

export default router;
