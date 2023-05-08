import jwt from 'jsonwebtoken';
import config from '../configurations/config';

/**
 * @breif Generate user jwt sign token
 * @param {Object} -> User object
 */
const signToken = (user) => {
  return jwt.sign({ user }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

/**
 * @breif Create and send as response jwt token
 * @param {Object} user -> User object
 * @param {statusCode} statusCode -> Response status code
 * @param {req} Request
 * @param {res} Response
 */
const createSendToken = (user, statusCode, res) => {
  // 1. Get token
  const token = signToken(user);

  // 2. Remove user password from output
  user.password = undefined;

  // 3. Send response
  res.status(statusCode).json({
    status: 'success',
    data: {
      user,
    },
  });
};

/**
 * @breif Controller to sigup a new user
 */
const signup = catchAsync(async (req, res, next) => {
  // 1. Pick required values
  const { name, email, telephone, store, password, passwordConfirm } = req.body;

  // 2. Create new user
  const newUser = await User.create({
    name,
    email,
    telephone,
    store,
    password,
    passwordConfirm,
  });

  // 3. Send response
  createSendToken(newUser, 201, req, res);
});

export default {
  signup,
};
