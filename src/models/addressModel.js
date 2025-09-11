const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema(
   {
      user: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: true,
      },
      firstName: {
         type: String,
         required: true,
      },
      lastName: {
         type: String,
         required: true,
      },
      address: {
         type: String,
         required: true,
      },
      city: {
         type: String,
         required: true,
      },
      state: {
         type: String,
         required: true,
      },
      zip: {
         type: String,
         required: true,
      },
      country: {
         type: String,
         required: true,
      },
      phone: {
         type: String,
         required: true,
      },
      isDefault: {
         type: Boolean,
         default: false,
      },
      state_code: {
         type: String,
         required: true,
      },
      type: {
         type: String,
         enum: ['home', 'office', 'other'],
      },
   },
   { timestamps: true }
);

module.exports = mongoose.model('Address', addressSchema);
