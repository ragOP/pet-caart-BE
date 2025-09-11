const mongoose = require('mongoose');

const newsLetterListSchema = new mongoose.Schema(
   {
      email: {
         type: String,
         required: true,
         unique: true,
      },
      name: {
         type: String,
         required: true,
      },
      isActive: {
         type: Boolean,
         default: true,
      },
   },
   { timestamps: true }
);

const NewLetterList = mongoose.model('NewsLetterList', newsLetterListSchema);

module.exports = NewLetterList;
