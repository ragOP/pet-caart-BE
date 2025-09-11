const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
   phoneNumber: {
      type: String,
      required: true,
   },
   otp: {
      type: String,
      required: true,
   },
   isVerified: {
      type: Boolean,
      default: false,
   },
   expiresAt: {
      type: Date,
      expires: 300,
      default: Date.now,
   },
   requestedAt: {
      type: Date,
      default: Date.now,
   },
});

const otpModel = mongoose.model('Otp', otpSchema);

module.exports = otpModel;
