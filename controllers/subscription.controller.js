import Subscription from '../models/subscription.model.js';
import factory from './handler.factory.js';

/**
 *
 * @breif Set Subscription user id
 */
const setSubscriptionUserId = (req, res, next) => {
  // Allow for nested routes
  if (!req.body.user) req.body.user = req.user.id || req.params.id;
  next();
};

const createSubscription = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! Please use /pay-subscription instead',
  });
};
const getSubscription = factory.getOne(Subscription);
const getAllSubscriptions = factory.getAll(Subscription);
const updateSubscription = factory.updateOne(Subscription);
const deleteSubscription = factory.deleteOne(Subscription);

export default {
  setSubscriptionUserId,
  createSubscription,
  getSubscription,
  getAllSubscriptions,
  updateSubscription,
  deleteSubscription,
};
