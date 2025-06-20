const mongoose = require('mongoose');

const BannerSchema = new mongoose.Schema({
  image: { type: String, required: true },
  type: { type: String, required: true, enum: ['web', 'app', 'mobile', 'tablet'] },
});

module.exports = mongoose.model('Banner', BannerSchema);
