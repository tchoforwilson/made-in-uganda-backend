import Subcription from '../models/subcription.model.js';
import factory from './handler.factory.js';

const setSubcriptionStoreId = (req, res, next) => {
  // Allow for nested routes
  if (!req.body.store) req.body.store = req.user.id || req.params.storeId;
  next();
};

const createSubscription = factory.createOne(Subcription);
const getSubcription = factory.getOne(Subcription);
const getAllSubcriptions = factory.getAll(Subcription);
const updateSubcription = factory.updateOne(Subcription);
const deleteSubcription = factory.deleteOne(Subcription);

export default {
  setSubcriptionStoreId,
  createSubscription,
  getSubcription,
  getAllSubcriptions,
  updateSubcription,
  deleteSubcription,
};
