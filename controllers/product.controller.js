import sharp from 'sharp';

import Product from '../models/product.model.js';
import factory from './handler.factory.js';
import upload from '../utilities/upload.js';
import catchAsync from '../utilities/catchAsync.js';

/**
 * @breif Set product store id
 * @param {Request} req -> Request Object
 * @param {Response} res -> Response Object
 * @param {Function} next -> Next function
 */
const setProductStoreId = (req, res, next) => {
  // Allow for nested routes
  if (!req.body.store) req.body.store = req.user.id || req.params.storeId;
  next();
};

/**
 * @breif Middleware to upload a product imageCover and images
 */
const uploadProductImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);

/**
 * @breif Resize product images to size 2000x1333 and convert format to jpeg
 * then product image in folder public/images/products
 */
const resizeProductImages = catchAsync(async (req, res, next) => {
  if (!req.files) return next();

  // 1) Cover image
  if (req.files.imageCover) {
    req.body.imageCover = `product-${req.user.id}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/images/products/${req.body.imageCover}`);
  }

  // 2) Images
  if (req.files.images && req.files.images.length > 0) {
    req.body.images = [];

    await Promise.all(
      req.files.images.map(async (file, i) => {
        const filename = `product-${req.user.id}-${Date.now()}-${i + 1}.jpeg`;

        await sharp(file.buffer)
          .resize(2000, 1333)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(`public/images/products/${filename}`);

        req.body.images.push(filename);
      })
    );
  }

  next();
});

const createProduct = factory.createOne(Product);
const updateProduct = factory.updateOne(Product);
const getProduct = factory.getOne(Product);
const getAllProducts = factory.getAll(Product);
const deleteProduct = factory.deleteOne(Product);

export default {
  setProductStoreId,
  uploadProductImages,
  resizeProductImages,
  createProduct,
  updateProduct,
  getProduct,
  getAllProducts,
  deleteProduct,
};
