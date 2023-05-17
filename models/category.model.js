import { Schema, model } from 'mongoose';

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'A category must have a name!'],
      lowercase: true,
      unique: true,
    },
    description: String,
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  }
);

const Category = model('Category', categorySchema);

export default Category;
