const mongoose = require('mongoose');

const BrandSchema = new mongoose.Schema(
   {
      name: { type: String, required: true },
      slug: { type: String, unique: true },
      logo: String,
      description: String,
      active: { type: Boolean, default: true },
      importedBy: String,
      countryOfOrigin: String,
      createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
   },
   { timestamps: true }
);

module.exports = mongoose.model('Brand', BrandSchema);
