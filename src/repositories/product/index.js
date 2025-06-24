const Product = require('../../models/productModel');

exports.createProduct = async product => {
    const newProduct = await Product.create(product);
    return newProduct;
};

exports.getSingleProduct = async id => {
    const product = await Product.findById(id);
    return product;
}

exports.getAllProducts = async (filters, skip = 0, limit = 50) => {
  const [products, total] = await Promise.all([
    Product.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({ path: "categoryId", select: "name _id" })
      .populate({ path: "subCategoryId", select: "name _id" })
      .populate({ path: "brandId", select: "name _id" })
      .populate({ path: "breedId", select: "name _id" }),
    Product.countDocuments(filters),
  ]);

  return { products, total };
};

exports.updateProduct = async (id, productData) => {
  const product = await Product.findByIdAndUpdate(id, productData, { new: true });
  return product;
};
