const Variant = require('../../models/variantModel');

exports.createManyVariants = async (variantArray) => {
  return await Variant.insertMany(variantArray);
};