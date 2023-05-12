import Subcription from '../models/subcription.model.js';
import factory from './handler.factory.js';

const createSubscription = factory.createOne(Subcription);
const getSubcription = factory.getOne(Subcription);
const getAllSubcriptions = factory.getAll(Subcription);
const updateSubcription = factory.updateOne(Subcription);
const deleteSubcription = factory.deleteOne(Subcription);

export default {
  createSubscription,
  getSubcription,
  getAllSubcriptions,
  updateSubcription,
  deleteSubcription,
};
