const mongoose = require('mongoose');

const BrandSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true },
  logo: String,
  description: String,
  active: { type: Boolean, default: true }
});

module.exports = mongoose.model('Brand', BrandSchema);