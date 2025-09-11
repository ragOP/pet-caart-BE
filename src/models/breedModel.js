const mongoose = require('mongoose');

const BreedSchema = new mongoose.Schema(
   {
      name: { type: String, required: true },
      species: { type: String, enum: ['dog', 'cat', 'rabbit', 'horse'], required: true },
      description: String,
      image: String,
      updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
   },
   { timestamps: true }
);

module.exports = mongoose.model('Breed', BreedSchema);
