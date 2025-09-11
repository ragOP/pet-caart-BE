const mongoose = require('mongoose');

const catLifeBannerSchema = new mongoose.Schema({
   isActive: {
      type: Boolean,
      default: true,
   },
   title: {
      type: String,
      required: true,
   },
   link: {
      type: String,
      required: true,
   },
   image: {
      type: String,
      required: true,
   },
});

catLifeBannerSchema.statics.createIfUnderLimit = async function (doc) {
   const count = await this.countDocuments();
   if (count >= 4) {
      throw new Error('Limit of 4 CatLifeBanner documents reached.');
   }
   return this.create(doc);
};

module.exports = mongoose.model('CatLifeBanner', catLifeBannerSchema);
