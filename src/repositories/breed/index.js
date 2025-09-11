const Breed = require('../../models/breedModel');

exports.createBreed = async breed => {
   const newBreed = await Breed.create(breed);
   return newBreed;
};

exports.getSingleBreed = async id => {
   const breed = await Breed.findById(id)
      .populate('createdBy', 'name')
      .populate('updatedBy', 'name');
   return breed;
};

exports.getAllBreeds = async (filters, skip = 0, limit = 50) => {
   const [breeds, total] = await Promise.all([
      Breed.find(filters)
         .sort({ createdAt: -1 })
         .skip(skip)
         .limit(limit)
         .populate('createdBy', 'name')
         .populate('updatedBy', 'name'),
      Breed.countDocuments(filters),
   ]);

   return { breeds, total };
};

exports.updateBreed = async (id, data) => {
   const updatedBreed = await Breed.findByIdAndUpdate(id, data, { new: true });
   return updatedBreed;
};
