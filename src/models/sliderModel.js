const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const sliderSchema = new mongoose.Schema(
  {
    images: {
      type: [
        {
          image: {
            type: String,
            required: true,
          },
          link: {
            type: String,
          },
          isActive: {
            type: Boolean,
            default: true,
          },
          id: {
            type: String,
            default: uuidv4(),
          },
          type: {
            type: String,
            required: true,
            enum: ['web', 'app', 'mobile', 'tablet'],
          },
        },
      ],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Slider', sliderSchema);
