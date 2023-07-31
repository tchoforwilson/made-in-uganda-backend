import { Schema, model } from 'mongoose';

const subscriptionSchema = new Schema({
  store: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Subcription must belong to a store!'],
  },
  amount: {
    type: Number,
    required: [true, 'Please provide subcription amount!'],
  },
  datePaid: {
    type: Date,
    default: Date.now(),
  },
  paid: {
    type: Boolean,
    default: false,
  },
});

/**
 * @breif Middleware to populate subcription with store (user)
 */
subscriptionSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'User',
    select: 'name email',
  });
  next();
});

const Subscription = model('Subcription', subscriptionSchema);

export default Subscription;
