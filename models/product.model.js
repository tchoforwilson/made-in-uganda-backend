import { model, Schema } from 'mongoose';
import { categories } from '../configurations/enums.js';

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide product name!'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide product price!'],
    },
    actualPrice: Number,
    weight: Number,
    imageCover: {
      type: String,
      required: [true, 'Please provide product photo'],
    },
    images: [String],
    description: String,
    category: {
      type: String,
      enum: {
        values: [...categories],
        message: 'Product must belong to a category',
      },
    },
    discount: {
      type: Number,
      default: 0,
    },
    store: {
      type: Schema.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  }
);

productSchema.pre('save', function (next) {
  this.actualPrice = this.price * ((100 - this.discount) / 100);
  next();
});

/**
 * @breif Populate product with store when find
 */
productSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'store',
    select: '-__v',
  });

  next();
});

const Product = model('Product', productSchema);

export default Product;
