const mongoose = require('mongoose');

const transcationSchema = new mongoose.Schema(
   {
      orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      type: { type: String, required: true, enum: ['order', 'refund'] },
      paymentMethod: {
         type: String,
         required: true,
         enum: ['razorpay', 'cod'],
      },
      razorpayOrderId: { type: String },
      razorpayPaymentId: { type: String },
      amount: { type: Number, required: true },
      status: { type: String, required: true, enum: ['pending', 'success', 'failed', 'refunded'] },
      transactionId: { type: String },
      refundReason: { type: String },
      refundAmount: { type: Number },
      refundStatus: { type: String, enum: ['pending', 'success', 'failed'] },
      refundTransactionId: { type: String },
      refundDate: { type: Date },
   },
   { timestamps: true }
);

module.exports = mongoose.model('Transcation', transcationSchema);
