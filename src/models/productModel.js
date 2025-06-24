const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  description: String,
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  subCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory' },
  breedId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Breed' }],
  brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
  price: Number,
  salePrice: Number,
  stock: Number,
  isActive: { type: Boolean, default: true },
  tags: [String],
  images: [String],
  attributes: mongoose.Schema.Types.Mixed,
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  isEverydayEssential: { type: Boolean, default: false },
  newleyLaunched: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
  isAddToCart: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);