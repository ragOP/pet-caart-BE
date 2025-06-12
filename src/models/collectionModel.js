const mongoose = require('mongoose');

const CollectionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  subCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory', required: true },
  image: String,
  description: String,
  productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  // type: { type: String, enum: ['manual', 'auto'], default: 'manual' },
  // filters: mongoose.Schema.Types.Mixed
});

module.exports = mongoose.model('Collection', CollectionSchema);