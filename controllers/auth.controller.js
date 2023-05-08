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
