const { mongoose } = require('mongoose');

const homeSectionSchema = new mongoose.Schema(
  {
    title: { type: String },
    contentType: {
      type: String,
      enum: ['product', 'category', 'subCategory', 'collection'],
      required: true,
    },
    contentItems: [
      {
        itemId: { type: mongoose.Schema.Types.ObjectId, refPath: 'contentTypeRef', required: true },
        link: { type: String, required: true },
        imageUrl: { type: String, required: true },
      },
    ],
    contentTypeRef: {
      type: String,
      enum: ['Product', 'Category', 'SubCategory', 'Collection'],
      required: true,
    },
    bannerImage: { type: String },
    backgroundImage: { type: String },
    grid: {
      rows: { type: Number, required: true },
      columns: { type: Number, required: true },
    },
    isActive: { type: Boolean, default: true },
    position: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('HomeSection', homeSectionSchema);
