import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import User from '../models/user.model.js';
import email from '../utilities/email.js';
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

/**
 * @breif Middleware to restrict route access only to user of
 * a particular role
 * @param  {...any} roles -> User roles
 * @returns {Function}
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'user']. role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    next();
  };
};

/**
 * @breif Controller for user to get token for password reset
 * after user forgot password
 */
const forgotPassword = catchAsync(async (req, res, next) => {
  // 1. Get user based on posted email and check if user exist
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError('There is no user with this email address.', 404));
  }

  // 2. Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3. Send it to the user's email
  const resetURL = `${req.protocol}://${req.get('host')}/${
    config.prefix
  }/users/resetPassword/${resetToken}`;

  // 4. Construct message
  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await email.sendEmailDev({
      email: user.email,
      subject: 'Your password reset token (valid for 10min)',
      message,
    }),
      // Send response
      res.status(200).json({
        status: 'success',
        message: 'Token sent to email!',
      });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }
});

/**
 * @breif Controller for user passsword reset
 */
const resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  createSendToken(user, 200, res);
});

/**
 * @breif Controller for updating user password
 */
const updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select('+password');

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong.', 401));
  }

  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // User.findByIdAndUpdate will NOT work as intended!

  // 4) Log user in, send JWT
  createSendToken(user, 200, req, res);
});

export default {
  signup,
  login,
  protect,
  restrictTo,
  forgotPassword,
  resetPassword,
  updatePassword,
};
