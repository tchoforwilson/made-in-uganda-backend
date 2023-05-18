import { Schema, model } from 'mongoose';

const subcriptionSchema = new Schema({
  store: {
    type: Schema.ObjectId,
    ref: 'User',
    required: [true, 'Subcription must belong to a store!'],
  },
  amount: {
    type: Number,
    required: [true, 'Please provide subcription amount!'],
  },
  paid: {
    type: Boolean,
    default: false,
  },
});

/**
 * @breif Middleware to populate subcription with store (user)
 */
subcriptionSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'User',
    select: 'name',
  });
  next();
});

const Subcription = model('Subcription', subcriptionSchema);

export default Subcription;
