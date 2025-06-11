const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
  label: String,
  street: String,
  city: String,
  pincode: String,
  state: String,
  country: String,
  isDefault: { type: Boolean, default: false }
});

const UserSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true, unique: true },
  otp: String,
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  name: { type: String, default: '' },
  email: { type: String, unique: true, sparse: true },
  address: [AddressSchema],
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  lastLogin: Date
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);