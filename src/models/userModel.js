const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
   {
      phoneNumber: { type: String, required: true, unique: true },
      isVerified: { type: Boolean, default: false },
      isActive: { type: Boolean, default: true },
      name: { type: String, default: '' },
      email: { type: String, unique: true, sparse: true },
      role: { type: String, enum: ['user', 'admin'], default: 'user' },
      fcmToken: { type: String, default: '' },
      apnToken: { type: String, default: '' },
      lastLogin: { type: Date, default: Date.now },
      referralCode: { type: String, unique: true, sparse: true },
      referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
      walletBalance: { type: Number, default: 0 },
      hasCompletedFirstOrder: { type: Boolean, default: false },
   },
   { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
