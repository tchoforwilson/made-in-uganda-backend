import { model, Schema } from 'mongoose';

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'A product must have a name!'],
      trim: true,
      maxlength: [
        40,
        'A product name must have less or equal then 40 characters',
      ],
      minlength: [
        5,
        'A product name must have more or equal then 10 characters',
      ],
    },
    price: {
      type: Number,
      required: [true, 'A product must have a price!'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // this only points to current doc on NEW document creation
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },
    percentageDiscount: Number,
    weight: Number,
    imageCover: {
      type: String,
      required: [true, 'A product must have a cover photo'],
    },
    images: [String],
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: Schema.ObjectId,
      ref: 'Category',
      required: [true, 'A product must belong to a category'],
    },
    store: {
      type: Schema.ObjectId,
      ref: 'User',
      required: [true, 'A product must belong to a store'],
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  }
);
/**
 * @breif Middleware to calculate percentage discount before save
 */
productSchema.pre('save', function (next) {
  this.percentageDiscount = 100 - (this.priceDiscount * 100) / this.price;
  next();
});

/**
 * @breif Populate product with store when find
 */
productSchema.pre(/^find/, function (next) {
  // Populate with category
  this.populate({
    path: 'category',
    select: '+name',
  });
  // Populate with store
  this.populate({
    path: 'store',
    select: '-__v -passwordChangedAt',
  });

  next();
});

const Product = model('Product', productSchema);

export default Product;
