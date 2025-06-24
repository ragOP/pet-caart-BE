const {
  createProduct,
  getSingleProduct,
  getAllProducts,
  updateProduct,
} = require('../../repositories/product/index.js');
const { createManyVariants, updateManyVariants, deleteVariantsByIds } = require('../../repositories/variant/index.js');

exports.createProduct = async productPayload => {
  const { variants, ...productData } = productPayload;

  // Step 1: Create Product
  const product = await createProduct(productData);

  // Step 2: Add productId to each variant
  const enrichedVariants = variants.map(variant => ({
    ...variant,
    productId: product._id,
  }));

  // Step 3: Bulk insert variants
  const createdVariants = await createManyVariants(enrichedVariants);

  return {
    product,
    variants: createdVariants,
  };
};

exports.getSingleProduct = async id => {
  const product = await getSingleProduct(id);
  return product;
};

exports.getAllProducts = async ({
  search,
  page,
  perPage,
  startDate,
  endDate,
  maxPrice,
  isEverydayEssential,
  isBestSeller,
  newleyLaunched,
  isAddToCart,
}) => {
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

  if (isEverydayEssential) {
    filters.isEverydayEssential = isEverydayEssential;
  }

  if (isBestSeller) {
    filters.isBestSeller = isBestSeller;
  }

  if (newleyLaunched) {
    filters.newleyLaunched = newleyLaunched;
  }

  if (isAddToCart) {
    filters.isAddToCart = isAddToCart;
  }

  const skip = (page - 1) * perPage;

  const { products, total } = await getAllProducts(filters, skip, perPage);

  return {
    data: products,
    total,
    page,
    perPage,
  };
};

exports.updateProduct = async (id, productPayload) => {
  const { variants, ...productData } = productPayload;

  const product = await updateProduct(id, productData);

  await product.save();

  if (variants) {
    // Fetch current variants from DB
    const currentVariants = product.variants || [];
    const currentVariantIds = currentVariants.map(v => v._id.toString());

    // Split incoming variants into new and existing
    const newVariants = variants.filter(v => !v._id);
    const updatedVariants = variants.filter(v => v._id);
    const updatedVariantIds = updatedVariants.map(v => v._id.toString());

    // Find deleted variants
    const deletedVariantIds = currentVariantIds.filter(id => !updatedVariantIds.includes(id));

    // Enrich new variants with productId
    const enrichedNewVariants = newVariants.map(variant => ({
      ...variant,
      productId: product._id,
    }));

    // Update existing variants
    let updatedVariantDocs = [];
    if (updatedVariants.length > 0) {
      updatedVariantDocs = await updateManyVariants(updatedVariants);
    }

    // Create new variants
    let createdVariantDocs = [];
    if (enrichedNewVariants.length > 0) {
      createdVariantDocs = await createManyVariants(enrichedNewVariants);
    }

    // Delete removed variants
    if (deletedVariantIds.length > 0) {
      await deleteVariantsByIds(deletedVariantIds);
    }

    // Set product.variants to the up-to-date list
    product.variants = [...updatedVariantDocs, ...createdVariantDocs];
    await product.save();
    return {
      success: true,
      message: 'Product updated successfully',
      product,
    };
  }
  return {
    success: true,
    message: 'Product updated successfully',
    product,
  };
};
