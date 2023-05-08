import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import User from '../models/user.model.js';
import config from '../configurations/config.js';
import catchAsync from '../utilities/catchAsync.js';
import AppError from '../utilities/appError.js';

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
    token,
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
  createSendToken(newUser, 201, res);
});

/**
 * @breif Controller to login an already registered user
 */
const login = catchAsync(async (req, res, next) => {
  // 1. Get email and password
  const { email, password } = req.body;

  // 2. Check if email and password exists
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // 3. Find user with email
  const user = await User.findOne({ email }).select('+password');

  // 4. Check if user exists && password is correct
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 400));
  }

  // 5. If everything ok, send token to client
  createSendToken(user, 200, req, res);
});

const protect = catchAsync(async (req, res, next) => {
  // 1. Get token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2. Token verification
  const decoded = await promisify(jwt.verify)(token, config.jwt.secret);

  // 3. Check if user still exist's
  const currentUser = await User.findById(decoded.user._id);

  if (!currentUser) {
    return next(
      new AppError("User belonging to this token no longer exist's", 401)
    );
  }

  // 4. Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('You recently changed password! please login again.', 401)
    );
  }

  // 5. GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

export default {
  signup,
  login,
  protect,
};
