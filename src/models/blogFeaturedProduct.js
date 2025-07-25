const mongoose = require('mongoose');

const blogFeaturedProductSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    bannerImage: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const BlogFeaturedProduct = mongoose.model('BlogFeaturedProduct', blogFeaturedProductSchema);

module.exports = BlogFeaturedProduct;
