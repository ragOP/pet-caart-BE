const { asyncHandler } = require('../../utils/asyncHandler/index');
const { uploadMultipleFiles } = require('../../utils/upload');
const {
  createProduct,
  getSingleProduct,
  getAllProducts,
  updateProduct,
} = require('../../services/product/index');
const ApiResponse = require('../../utils/apiResponse/index');

exports.handleCreateProduct = asyncHandler(async (req, res) => {
  const { images = [], variantImages = [] } = req.files;

  const imageUrls = await uploadMultipleFiles(images);
  const uploadedVariantImages = await uploadMultipleFiles(variantImages);

  const {
    title,
    slug,
    description,
    categoryId,
    subCategoryId,
    breedId,
    brandId,
    hsnCode,
    variants,
    variantImageMap,
    price,
    salePrice,
    stock,
    isActive = true,
    isEverydayEssential = false,
    isBestSeller = false,
    isNewleyLaunched = false,
    isAddToCart = false,
    tags,
    attributes,
    ratings,
  } = req.body;

  // Parse all incoming data
  const parsedVariants = Array.isArray(variants)
    ? variants.map(v => JSON.parse(v))
    : [JSON.parse(variants)];
  const parsedBreedIds = typeof breedId === 'string' ? JSON.parse(breedId) : breedId;
  const parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
  const parsedAttributes = typeof attributes === 'string' ? JSON.parse(attributes) : attributes;
  const parsedRatings = typeof ratings === 'string' ? JSON.parse(ratings) : ratings;
  const parsedVariantImageMap = JSON.parse(variantImageMap || '[]');

  // Group variant images by variant index
  const variantImageGroups = {};
  parsedVariantImageMap.forEach((item, idx) => {
    const index = item.index;
    if (!variantImageGroups[index]) {
      variantImageGroups[index] = [];
    }
    variantImageGroups[index].push(uploadedVariantImages[idx]);
  });

  // Inject images into variants
  const enrichedVariants = parsedVariants.map((variant, index) => ({
    ...variant,
    images: variantImageGroups[index] || [],
  }));

  const productPayload = {
    title,
    slug,
    description,
    categoryId,
    subCategoryId,
    breedId: parsedBreedIds,
    brandId,
    price,
    salePrice,
    stock,
    isActive,
    isEverydayEssential,
    isBestSeller,
    isNewleyLaunched,
    isAddToCart,
    images: imageUrls,
    variants: enrichedVariants,
    tags: parsedTags,
    attributes: parsedAttributes,
    ratings: parsedRatings,
    hsnCode,
  };

  const result = await createProduct(productPayload);

  return res
    .status(201)
    .json(new ApiResponse(201, result, 'Product with variants created successfully', true));
});

exports.handleGetAllProducts = asyncHandler(async (req, res) => {
  const {
    search,
    page = 1,
    per_page = 50,
    start_date,
    end_date,
    max_price,
    isEverydayEssential,
    isBestSeller,
    newleyLaunched,
    isAddToCart,
    categorySlug,
    subCategorySlug,
    brandSlug,
    breedSlug,
    min_price_range,
    max_price_range,
    sort_by,
    rating,
    collectionSlug,
  } = req.query;
  const result = await getAllProducts({
    search,
    page,
    perPage: per_page,
    startDate: start_date,
    endDate: end_date,
    maxPrice: max_price,
    isEverydayEssential,
    isBestSeller,
    newleyLaunched,
    isAddToCart,
    categorySlug,
    subCategorySlug,
    brandSlug,
    breedSlug,
    minPriceRange: min_price_range,
    maxPriceRange: max_price_range,
    sortBy: sort_by,
    rating,
    collectionSlug,
  });
  return res.status(200).json(new ApiResponse(200, result, 'Products fetched successfully', true));
});

exports.handleGetSingleProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json(new ApiResponse(400, null, 'Product id is required'));
  }
  const result = await getSingleProduct(id);
  return res.status(200).json(new ApiResponse(200, result, 'Product fetched successfully', true));
});

exports.handleUpdateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { body } = req;
  const { images = [], variantImages = [] } = req.files;

  // upload Images
  const imageUrls = await uploadMultipleFiles(images);
  const uploadedVariantImages = await uploadMultipleFiles(variantImages);
  body.images = imageUrls;

  // parse variants
  const variantImageMap = body.variantImageMap;
  const parsedVariants = Array.isArray(body.variants)
    ? body.variants.map(v => JSON.parse(v))
    : [JSON.parse(body.variants)];
  const parsedBreedIds = typeof body.breedId === 'string' ? JSON.parse(body.breedId) : body.breedId;
  const parsedTags = typeof body.tags === 'string' ? JSON.parse(body.tags) : body.tags;
  const parsedAttributes =
    typeof body.attributes === 'string' ? JSON.parse(body.attributes) : body.attributes;
  const parsedRatings = typeof body.ratings === 'string' ? JSON.parse(body.ratings) : body.ratings;
  const parsedVariantImageMap = JSON.parse(variantImageMap || '[]');
  const variantImageGroups = {};
  parsedVariantImageMap.forEach((item, idx) => {
    const index = item.index;
    if (!variantImageGroups[index]) {
      variantImageGroups[index] = [];
    }
    variantImageGroups[index].push(uploadedVariantImages[idx]);
  });

  // inject images into variants
  const enrichedVariants = parsedVariants.map((variant, index) => ({
    ...variant,
    images: variantImageGroups[index] || [],
  }));
  body.variants = enrichedVariants;

  // create product payload
  const productPayload = {
    title: body.title,
    slug: body.slug,
    description: body.description,
    categoryId: body.categoryId,
    subCategoryId: body.subCategoryId,
    breedId: parsedBreedIds,
    brandId: body.brandId,
    price: body.price,
    salePrice: body.salePrice,
    stock: body.stock,
    isActive: body.isActive,
    isEverydayEssential: body.isEverydayEssential,
    isBestSeller: body.isBestSeller,
    newleyLaunched: body.isNewleyLaunched,
    isAddToCart: body.isAddToCart,
    images: imageUrls,
    variants: enrichedVariants,
    tags: parsedTags,
    attributes: parsedAttributes,
    ratings: parsedRatings,
    hsnCode: body.hsnCode,
  };

  // update product
  const result = await updateProduct(id, productPayload);
  if (!result) {
    return res.status(404).json(new ApiResponse(404, null, 'Product not found'));
  }
  return res.status(200).json(new ApiResponse(200, result, 'Product updated successfully', true));
});
