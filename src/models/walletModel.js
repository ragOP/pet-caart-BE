const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema(
   {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      amount: { type: Number, required: true, default: 0 },
      type: { type: String, enum: ['credit', 'debit'], required: true },
      description: { type: String, default: '' },
   },
   { timestamps: true }
);
module.exports = mongoose.model('Wallet', walletSchema);
