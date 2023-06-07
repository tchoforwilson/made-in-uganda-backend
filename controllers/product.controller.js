import sharp from 'sharp';

import Product from '../models/product.model.js';
import factory from './handler.factory.js';
import upload from '../utilities/upload.js';
import catchAsync from '../utilities/catchAsync.js';

const setProductStore = (req, res, next) => {
  // Allow for nested routes
  if (!req.body.store) req.body.store = req.user.store.id;
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
 * @breif Resize product images to size 640x640 and convert format to jpeg
 * then product image in folder public/images/products
 */
const resizeProductImages = catchAsync(async (req, res, next) => {
  if (!req.files) return next();

  // 1) Cover image
  if (req.files.imageCover) {
    req.body.imageCover = `product-${
      req.params.id || req.user.store.id
    }-${Date.now()}-cover.jpeg`; // Set image cover name field
    //Upload image
    await sharp(req.files.imageCover[0].buffer)
      .resize(640, 640, { fit: sharp.fit.cover })
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/images/products/${req.body.imageCover}`);
  }

  // 2) Images
  if (req.files.images && req.files.images.length > 0) {
    req.body.images = [];

    await Promise.all(
      req.files.images.map(async (file, i) => {
        const filename = `product-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

        await sharp(file.buffer)
          .resize(640, 640, { fit: sharp.fit.cover })
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(`public/images/products/${filename}`);

        req.body.images.push(filename);
      })
    );
  }

  next();
});

export default {
  setProductStore,
  uploadProductImages,
  resizeProductImages,
  createProduct: factory.createOne(Product),
  updateProduct: factory.updateOne(Product),
  getProduct: factory.getOne(Product, { path: 'store' }),
  getAllProducts: factory.getAll(Product),
  deleteProduct: factory.deleteOne(Product),
};
