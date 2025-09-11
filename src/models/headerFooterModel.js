const mongoose = require('mongoose');

const headerFooterSchema = new mongoose.Schema({
   logo: { type: String },
   address: { type: String },
   phone: { type: String },
   email: { type: String },
   facebook: { type: String },
   instagram: { type: String },
   twitter: { type: String },
   linkedin: { type: String },
   youtube: { type: String },
});

module.exports = mongoose.model('HeaderFooter', headerFooterSchema);
