import AppError from '../utilities/appError';
import catchAsync from '../utilities/catchAsync';
import APIFeatures from '../utilities/apiFeatures';

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
      data: {
        doc,
      },
    });
  });

/**
 * @breif Get a single document in the database collection
 * using the parameter request id
 * @param {Collection} Model -> Database collection
 * @returns {function}
 */
const getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    // 1. Get document
    const doc = await Model.findById(req.params.id);

    // 2. Check if document exist's
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    // 3. Send response
    res.status(200).json({
      status: 'success',
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

    // 2. EXECUTE THE QUERY
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const docs = await features.query;

    // 3. SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: {
        data: docs,
      },
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
      data: null,
    });
  });

export default {
  createOne,
  getOne,
  updateOne,
  getAll,
  deleteOne,
};
