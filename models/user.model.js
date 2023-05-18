import crypto from 'crypto';
import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';

import config from '../configurations/config.js';

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your store name'],
  },
  shop: {
    type: String,
    required: [true, 'Please provide shop name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your store email'],
    unique: [true, 'This account already exist'],
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Please provide a valid email!'],
  },
  telephone: {
    type: String,
    validate: [validator.isMobilePhone],
  },
  photo: String,
  employees: {
    type: Number,
    required: [true, 'Please provide number of employees'],
  },
  location: {
    // GeoJSON
    type: {
      type: String,
      default: 'Point',
      enum: ['Point'],
    },
    coordinates: [Number],
    address: {
      city: {
        type: String,
        required: [true, 'Please provide store or shop city'],
      },
      address_line: {
        type: String,
        required: [true, 'Please provide store or shop address line'],
      },
    },
    description: String,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

/**
 * @breif Middleware to encrypt user password before save
 */
userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

/**
 * @breif Middleware to save user password changed date
 */
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  // * Donot remove time during test because it causes it to failed
  if (config.env === 'production' || config.env === 'development') {
    this.passwordChangedAt = Date.now();
    -1000; // This is done because token might be created before password changed
  } else {
    this.passwordChangedAt = Date.now();
  }
  next();
});

/**
 * @breif Middleware not select inactive users
 */
userSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

/**
 * @breif function to verify if provided user password is correct during login
 * @param {String} candidatePassword -> User provided password
 * @param {String} userPassword -> Stored user password
 * @return {Boolean}
 */
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

/**
 * @breif Method to check if user changed password after login
 * @param {String} JWTTimestamp -> JWT time
 */
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

/**
 * @breif Method to create/generate a hash for password reset
 */
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = model('User', userSchema);

export default User;
