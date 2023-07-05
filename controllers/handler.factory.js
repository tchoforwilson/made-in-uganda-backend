import AppError from '../utilities/appError.js';
import catchAsync from '../utilities/catchAsync.js';
import APIFeatures from '../utilities/apiFeatures.js';

/**
 * @breif Create a new document in a database collection
 * @param {Collection} Model -> Database collection
 * @returns {function}
 */
const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    // 1. Create document
    const doc = await Model.create(req.body);

    // 2. Send resposne
    res.status(201).json({
      status: 'success',
      message: 'Data saved',
      data: doc,
    });
  });

/**
 * @breif Get a single document in the database collection
 * using the parameter request id
 * @param {Collection} Model -> Database collection
 * @param {Object} popOptions -> Populate options
 * @returns {function}
 */
const getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    // 1. Get document
    let query = Model.findById(req.params.id);

    // 2. Populate with options
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    // 3. Check if document exist's
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    // 4. Send response
    res.status(200).json({
      status: 'success',
      message: 'Data fetch',
      data: doc,
    });
  });

/**
 * @breif Update a single a documnent in the collection, from the
 * request paramter id
 * @param {Collection} Model -> Database collection
 * @returns {function}
 */
const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) return next(new AppError('No document found with that ID!', 404));

    res.status(200).json({
      status: 'success',
      message: 'Data updated',
      data: doc,
    });
  });

/**
 * @breif Retrieve all document from a collection, documents are filtered, sorted,
 * limited and paginated
 * @param {Collection} Model -> Database collection
 * @returns {function}
 */
const getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // 1. To allow for nested GET product & subcription o
    let filter = {};
    if (req.params.storeId) filter = { store: req.params.storeId };
    if (req.params.categoryId) filter = { category: req.params.categoryId };

    // 2. Build search regex for name
    if (req.query.name)
      req.query['name'] = { $regex: req.query.name, $options: 'i' };

    // 3. EXECUTE THE QUERY
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const docs = await features.query;

    // 4. SEND RESPONSE
    res.status(200).json({
      status: 'success',
      message: 'Data fetch',
      results: docs.length,
      data: docs,
    });
  });

/**
 * @breif Delete a single document in the database collection
 * @param {Collection} Model -> Database collection
 * @returns {function}
 */
const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    // 1. Find document and delete
    const doc = await Model.findByIdAndDelete(req.params.id);

    // 2. Check if document exist's
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    // 3. Send the response
    res.status(204).json({
      status: 'success',
      message: 'Data deleted',
      data: null,
    });
  });

const getDistinct = (Model, field) =>
  catchAsync(async (req, res, next) => {
    const docs = await Model.distinct(field);

    res.status(200).json({
      status: 'success',
      message: 'Data fetch',
      data: docs,
    });
  });

/**
 * @brief Count the number of document in a collection
 * @param {Collection} Model  -> Model
 * @returns {Function}
 */
const getCount = (Model) =>
  catchAsync(async (req, res, next) => {
    const count = await Model.count(req.query);
    res.status(200).json({
      status: 'success',
      message: 'Data counted',
      data: count,
    });
  });

export default {
  createOne,
  getOne,
  updateOne,
  getAll,
  deleteOne,
  getCount,
};
