import sharp from 'sharp';

import Product from '../models/product.model.js';
import factory from './handler.factory.js';
import upload from '../utilities/upload.js';
import catchAsync from '../utilities/catchAsync.js';
import AppError from '../utilities/appError.js';

/**
 * @breif Middleware to upload a single product image
 */
const uploadProductImage = upload.single('image');

/**
 * @breif Resize product image to size 700x700 and convert format to jpeg
 * then product image in folder public/images/products
 */
const resizeProductImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `product-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(700, 700)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/images/products/${req.file.filename}`);

  next();
});

const getProduct = factory.getOne(Product);
const getAllProduct = factory.getAll(Product);
const deleteProduct = factory.deleteOne(Product);

export default {
  uploadProductImage,
  resizeProductImage,
  getProduct,
  getAllProduct,
  deleteProduct,
};
