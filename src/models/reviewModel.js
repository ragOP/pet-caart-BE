const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
   {
      userId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: true,
      },
      productId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Product',
         required: true,
      },
      orderId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Order',
         required: true,
      },
      review: {
         type: String,
         required: false,
      },
      rating: {
         type: Number,
         required: true,
      },
   },
   { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);
