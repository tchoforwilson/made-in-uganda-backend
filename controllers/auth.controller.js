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
