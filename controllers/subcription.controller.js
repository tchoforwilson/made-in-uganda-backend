import Subcription from '../models/subcription.model.js';
import factory from './handler.factory.js';

/**
 *
 * @breif Set subcription user id
 */
const setSubcriptionUserId = (req, res, next) => {
  // Allow for nested routes
  if (!req.body.user) req.body.user = req.user.id || req.params.id;
  next();
};

const createSubscription = factory.createOne(Subcription);
const getSubcription = factory.getOne(Subcription);
const getAllSubcriptions = factory.getAll(Subcription);
const updateSubcription = factory.updateOne(Subcription);
const deleteSubcription = factory.deleteOne(Subcription);

export default {
  setSubcriptionUserId,
  createSubscription,
  getSubcription,
  getAllSubcriptions,
  updateSubcription,
  deleteSubcription,
};
