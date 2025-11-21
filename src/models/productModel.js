const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
   {
      title: { type: String, required: true },
      slug: { type: String, unique: true },
      description: String,
      productLabel: String,
      categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
      subCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory' },
      breedId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Breed' }],
      brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
      price: Number,
      salePrice: Number,
      stock: Number,
      sku: { type: String, unique: true },
      importedBy: String,
      countryOfOrigin: String,
      isActive: { type: Boolean, default: true },
      tags: [String],
      images: [String],
      commonImages: [String],
      attributes: mongoose.Schema.Types.Mixed,
      weight: {
         type: Number,
         default: 0,
      },
      ratings: {
         average: { type: Number, default: 0 },
         count: { type: Number, default: 0 },
      },
      isBestSeller: { type: Boolean, default: false },
      isVeg: { type: Boolean, default: false },
      isSpecialOffer: { type: Boolean, default: false },
      lifeStage: { type: String, enum: ['Puppy', 'Adult', 'Starter', 'Kitten'], default: 'Adult' },
      breedSize: { type: String, enum: ['Mini', 'Medium', 'Large', 'Giant'], default: 'Medium' },
      productType: {
         type: String,
         enum: ['Wet Food', 'Dry Food', 'Food Toppers', 'Treat', 'Toys', 'Accessories', 'Clothes'],
         default: 'Dry Food',
      },
   },
   { timestamps: true }
);

module.exports = mongoose.model('Product', ProductSchema);
