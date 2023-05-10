import { model, Schema } from 'mongoose';
import categories from '../configurations/category.js';

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
    weight: Number,
    photo: {
      type: String,
      required: [true, 'Please provide product photo'],
    },
    description: String,
    category: {
      type: String,
      enum: {
        values: [...categories],
        message: 'Product must belong to a category',
      },
    },
    discount: Number,
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

/**
 * @breif Populate product with store when find
 */
productSchema.pre('/^find/', function (next) {
  this.populate({
    path: 'store',
    select: '-__v',
  });
});

const Product = model('Product', productSchema);

export default Product;
