const mongoose = require('mongoose');

const ContactUsSchema = new mongoose.Schema(
   {
      message: { type: String, required: true },
      email: { type: String, required: true },
      name: { type: String, required: true },
      responded: { type: Boolean, default: false },
      responseMessage: { type: String },
      respondedAt: { type: Date },
   },
   { timestamps: true }
);

module.exports = mongoose.model('ContactUs', ContactUsSchema);
