const { createProduct, getSingleProduct, getAllProducts } = require('../../repositories/product/index.js');
const { createManyVariants } = require('../../repositories/variant/index.js');

exports.createProduct = async productPayload => {
  const { variants, ...productData } = productPayload;

   // Step 1: Create Product
  const product = await createProduct(productData);

  // Step 2: Add productId to each variant
  const enrichedVariants = variants.map(variant => ({
    ...variant,
    productId: product._id
  }));

    // Step 3: Bulk insert variants
  const createdVariants = await createManyVariants(enrichedVariants);

  return {
    product,
    variants: createdVariants
  };
};

exports.getSingleProduct = async id => {
  const product = await getSingleProduct(id);
  return product;
};

exports.getAllProducts = async ({ search, page, perPage, startDate, endDate, maxPrice }) => {
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

  if (maxPrice) {
    filters.price = { $lt: maxPrice };
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
