const Variant = require('../../models/variantModel');

exports.createManyVariants = async variantArray => {
  return await Variant.insertMany(variantArray);
};

exports.updateVariant = async (id, updateData) => {
  return await Variant.findByIdAndUpdate(id, updateData, { new: true });
};

exports.updateManyVariants = async variants => {
  const updatePromises = variants.map(variant =>
    Variant.findByIdAndUpdate(variant._id, variant, { new: true })
  );
  return await Promise.all(updatePromises);
};

exports.deleteVariantsByIds = async ids => {
  return await Variant.deleteMany({ _id: { $in: ids } });
};
