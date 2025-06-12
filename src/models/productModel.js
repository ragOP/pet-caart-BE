const mongoose = require('mongoose');

const VariantSchema = new mongoose.Schema({
  sku: { type: String, required: true },
  weight: String,
  price: { type: Number, required: true },
  salePrice: Number,
  stock: { type: Number, default: 0 },
  barcode: String
});

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  description: String,
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  subCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory' },
  breedId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Breed' }],
  brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
  variants: [VariantSchema],
  price: Number,
  salePrice: Number,
  stock: Number,
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  tags: [String],
  images: [String],
  attributes: mongoose.Schema.Types.Mixed,
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);