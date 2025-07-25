const mongoose = require('mongoose');

const blogFeaturedProductSchema = new mongoose.Schema(
  {
    productIds: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Product',
      required: true,
      default: [],
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
