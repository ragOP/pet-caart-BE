const collectionModel = require('../../models/collectionModel.js');
const variantModel = require('../../models/variantModel.js');
const {
  createProduct,
  getSingleProduct,
  getAllProducts,
  updateProduct,
} = require('../../repositories/product/index.js');
const {
  createManyVariants,
  updateManyVariants,
  deleteVariantsByIds,
} = require('../../repositories/variant/index.js');

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
  const variants = await variantModel.find({ productId: id });
  const updatedProductWithVariants = {
    ...product._doc,
    variants,
  };
  return updatedProductWithVariants;
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
  categorySlug,
  subCategorySlug,
  brandSlug,
  breedSlug,
  minPriceRange,
  maxPriceRange,
  sortBy,
  rating,
  collectionSlug,
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

  if (collectionSlug) {
    const collection = await collectionModel.findOne({ slug: collectionSlug });
    filters = { _id: { $in: collection.productIds } };
  }

  const skip = (page - 1) * perPage;

  if (minPriceRange && maxPriceRange) {
    filters.price = { $gte: minPriceRange, $lte: maxPriceRange };
  }

  const sort = {};

  if (sortBy) {
    if (sortBy === 'priceLowToHigh') {
      sort.price = 1;
    } else if (sortBy === 'priceHighToLow') {
      sort.price = -1;
    }
  } else {
    sort.createdAt = -1;
  }

  if (rating) {
    filters['ratings.average'] = { $gte: rating };
  }

  const { products, total } = await getAllProducts(
    filters,
    skip,
    perPage,
    categorySlug,
    subCategorySlug,
    brandSlug,
    breedSlug,
    sort
  );

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

  const availableVariants = await variantModel.find({ productId: id });

  if (!product) {
    return {
      statusCode: 404,
      success: false,
      message: 'Product not found',
      data: null,
    };
  }

  if (variants) {
    // 1. Fetch current variants from DB
    const currentVariants = availableVariants || [];
    const currentVariantIds = currentVariants.map(v => v._id.toString());

    // 2. Split incoming variants into new and existing
    const newVariants = variants.filter(v => {
      const existingVariant = availableVariants.find(av => av.sku === v.sku);
      return !existingVariant;
    });

    // 3. Find updated variants
    const updatedVariants = variants.filter(v => {
      const existingVariant = availableVariants.find(av => av.sku === v.sku);
      return existingVariant;
    });

    // 4. Find updated variant IDs
    const updatedVariantIds = updatedVariants.map(v => {
      const existingVariant = availableVariants.find(av => av.sku === v.sku);
      return existingVariant._id.toString();
    });

    // 5. Find deleted variant IDs
    const deletedVariantIds = currentVariantIds.filter(id => !updatedVariantIds.includes(id));

    // 6. Enrich new variants with productId
    const enrichedNewVariants = newVariants.map(variant => ({
      ...variant,
      productId: product._id,
    }));

    // 7. Update existing variants
    let updatedVariantDocs = [];
    if (updatedVariants.length > 0) {
      updatedVariantDocs = await updateManyVariants(updatedVariants);
    }

    // 8. Create new variants
    let createdVariantDocs = [];
    if (enrichedNewVariants.length > 0) {
      createdVariantDocs = await createManyVariants(enrichedNewVariants);
    }

    // 9. Delete removed variants
    if (deletedVariantIds.length > 0) {
      await deleteVariantsByIds(deletedVariantIds);
    }

    // 10. Set product.variants to the up-to-date list
    product.variants = [...updatedVariantDocs, ...createdVariantDocs];
    await product.save();
    return {
      statusCode: 200,
      success: true,
      message: 'Product updated successfully',
      product,
    };
  }
  return {
    statusCode: 200,
    success: true,
    message: 'Product updated successfully',
    product,
  };
};
