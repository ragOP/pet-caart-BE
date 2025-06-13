const { createProduct, getSingleProduct, getAllProducts } = require('../../repositories/product/index.js');

exports.createProduct = async product => {
  const newProduct = await createProduct(product);
  return newProduct;
};

exports.getSingleProduct = async id => {
  const product = await getSingleProduct(id);
  return product;
};

exports.getAllProducts = async ({ search, page, perPage, startDate, endDate }) => {
  let filters = {};

  if (search) {
    filters.$or = [
      { name: { $regex: search, $options: 'i' } },
      { slug: { $regex: search, $options: 'i' } },
    ];
  }

  if (startDate || endDate) {
    filters.createdAt = {};
    if (startDate) filters.createdAt.$gte = new Date(startDate);
    if (endDate) filters.createdAt.$lte = new Date(endDate);
  }

  const skip = (page - 1) * perPage;

  const { products, total } = await getAllProducts(filters, skip, perPage);

  return {
    data: products,
    total,
    page,
    perPage,
  };
  return products;
};
