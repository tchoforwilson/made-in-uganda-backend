import Category from '../models/category.model.js';
import Store from '../models/store.model.js';
import Product from '../models/product.model.js';
import catchAsync from '../utilities/catchAsync.js';

/**
 * @breif Search controller for all models.
 */
const search = catchAsync(async (req, res, next) => {
  // 1. Get the query
  const { q } = req.query;

  // 2. Get the results
  // a. From Product
  const products = await Product.find({
    name: { $regex: q, $options: 'i' },
  }).populate('store category');

  // b. From Store
  const stores = await Store.find({
    name: { $regex: q, $options: 'i' },
  }).populate('products');

  // c. From Category
  const categories = await Category.find({
    name: { $regex: q, $options: 'i' },
  }).populate('products');

  // 3. Build result with output
  const results = [...products, ...stores, ...categories];

  // 4. Send the response
  res.status(200).json({
    status: 'success',
    data: results,
  });
});

export default {
  search,
};
