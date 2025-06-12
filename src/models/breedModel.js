const mongoose = require('mongoose');

const BreedSchema = new mongoose.Schema({
  name: { type: String, required: true },
  species: { type: String, enum: ['dog', 'cat', 'rabbit', 'horse'], required: true },
  description: String,
  image: String
});

module.exports = mongoose.model('Breed', BreedSchema);