const Variant = require('../../models/variantModel');

exports.createManyVariants = async variantArray => {
   return await Variant.insertMany(variantArray);
};

exports.updateVariant = async (id, updateData) => {
   return await Variant.findByIdAndUpdate(id, updateData, { new: true });
};

exports.updateManyVariants = async (variants, availableVariants) => {
   const updatePromises = variants.map(variant => {
      const existingVariant = availableVariants.find(av => av.sku === variant.sku);
      if (!existingVariant) {
         return {
            statusCode: 404,
            message: 'Variant not found',
            data: null,
         };
      }
      return Variant.findByIdAndUpdate(existingVariant._id, variant, { new: true });
   });
   return await Promise.all(updatePromises);
};

exports.deleteVariantsByIds = async ids => {
   return await Variant.deleteMany({ _id: { $in: ids } });
};
