import Category from '../models/category.model.js';
import factory from './handler.factory.js';

/**
 * @breif Controllers for category
 */
export default {
  createCategory: factory.createOne(Category),
  getCategory: factory.getOne(Category),
  getAllCategories: factory.getAll(Category),
  updateCategory: factory.updateOne(Category),
  deleteCategory: factory.deleteOne(Category),
};
