const productModel = require("../../models/productModel");

exports.handleGenerateSlug = async (slug) => {
    const baseSlug = slug;
    let newSlug = baseSlug;
    let counter = 1;

    while (await productModel.findOne({ slug: newSlug })) {
        newSlug = `${baseSlug}-${counter}`;
        counter++;
    }

   return newSlug;
}