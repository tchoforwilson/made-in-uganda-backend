import request from 'supertest';
import jwt from 'jsonwebtoken';

import User from '../../models/user.model.js';
import server from '../../server.js';
import config from '../../configurations/config.js';

/// @breif API request services
export const api = request(server);

/// @breif application base url
export const BASE_URL = config.prefix;

const signToken = (user) => {
  return jwt.sign({ user }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

export const createUser = async () => {
  return await User.create({
    name: 'Mary James',
    email: 'mary@gmail.com',
    password: 'pass1234',
    passwordConfirm: 'pass1234',
  });
};

/**
 * Generate a new request header token, set the authorization to Bearer.
 * This header token is generated from the user id
 * @param {Object} user -> User object
 * @returns {String} token
 */
export const getHeader = (user) => {
  const token = signToken(user);
  return 'Bearer ' + token;
};

export const closeServer = () => {
  server.close();
};
