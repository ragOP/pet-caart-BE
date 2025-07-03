const mongoose = require('mongoose');

const SubCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    image: String,
    dynamicFields: mongoose.Schema.Types.Mixed,
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SubCategory', SubCategorySchema);
