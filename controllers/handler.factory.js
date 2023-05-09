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
