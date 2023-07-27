import { Schema, model } from 'mongoose';
import validator from 'validator';

const storeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    employees: {
      type: Number,
      required: [true, 'Please provide number of employees'],
    },
    telephone: {
      type: String,
      validate: [validator.isMobilePhone],
    },
    logo: {
      type: String,
    },
    address: {
      line_1: {
        type: String,
        required: [true, 'Please provide address line'],
      },
      line_2: String,
      city: {
        type: String,
        required: [true, 'Please tell us the city'],
      },
      region: {
        type: String,
        required: [true, 'Provide the state/province/region'],
      },
      zipcode: {
        type: String,
        required: [true, 'Provide zipcode'],
      },
    },
    location: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
    },
    user: {
      type: Schema.ObjectId,
      ref: 'User',
      required: [true, 'Store must belong to an owner'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  }
);

// Virtual populate
storeSchema.virtual('products', {
  ref: 'Product',
  foreignField: 'store',
  localField: '_id',
});

/**
 * @breif Populate store with user when find
 */
storeSchema.pre(/^find/, function (next) {
  // Populate with user
  this.populate({
    path: 'user',
    select: 'username email _id id',
  });
  next();
});

const Store = model('Store', storeSchema);

export default Store;
