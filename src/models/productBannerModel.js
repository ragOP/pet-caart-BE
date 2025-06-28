const mongoose = require('mongoose');

const productBannerSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    type: {
      type: String,
      enum: ['web', 'tablet', 'mobile', 'app'],
      required: true,
    },
  },
  { timestamps: true }
);

const ProductBanner = mongoose.model('ProductBanner', productBannerSchema);

module.exports = ProductBanner;
