import { Schema, model } from 'mongoose';

const subcriptionSchema = new Schema({
  store: {
    type: Schema.ObjectId,
    ref: 'User',
    required: [trur, 'subcription must belong to a store!'],
  },
  price: {
    type: Number,
    required: [true, 'Booking must have a price.'],
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
