import AppError from '../utilities/appError';
import catchAsync from '../utilities/catchAsync';

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

export default {
  createOne,
  getOne,
};
