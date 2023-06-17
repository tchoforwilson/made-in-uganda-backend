import sharp from 'sharp';
import Store from '../models/store.model.js';
import factory from './handler.factory.js';
import upload from '../utilities/upload.js';
import catchAsync from '../utilities/catchAsync.js';

// Set store owner
const setStoreUser = (req, res, next) => {
  // Allowed for nested routes
  if (!req.body.owner) req.body.owner = req.user.id;
  next();
};

// Upload store logo
const uploadStoreLogo = upload.single('logo');

// Resize store logo
const resizeStoreLogo = catchAsync(async (req, res, next) => {
  // 1. Check if file is present
  if (!req.file) return next();

  // 2. Change file name
  req.file.filename = `logo-${req.params.id}-${Date.now()}.png`;

  // 3. Upload and resize logo
  await sharp(req.file.buffer)
    .resize(250, 100, { fit: 'contain' })
    .toFormat('png')
    .png({ quality: 90 })
    .flatten({ background: '#00FFFFFF' })
    .toFile(`public/images/stores/${req.file.filename}`);

  next();
});

// Set store logo
const setStoreLogo = (req, res, next) => {
  // Allowed for file upload
  if (req.file) req.body.logo = req.file.filename;
  next();
};

export default {
  setStoreUser, // Set store owner
  uploadStoreLogo, // Upload store logo
  resizeStoreLogo, // resize store logo
  setStoreLogo, // Set store logo
  createStore: factory.createOne(Store), //  Create a new store
  getAllStores: factory.getAll(Store), // Get all stores
  getStore: factory.getOne(Store, { path: 'products', select: '-__v' }), // Get a store
  updateStore: factory.updateOne(Store), // Update a store
  deleteStore: factory.deleteOne(Store), // Delete a store
  getStoresCount: factory.getCount(Store), // Count stores
};
