const { createProduct, getSingleProduct, getAllProducts } = require('../../services/product/index.js');
const { asyncHandler } = require('../../utils/asyncHandler/index');
const ApiResponse = require('../../utils/apiResponse/index');
const { uploadMultipleFiles } = require('../../utils/upload/index');

exports.handleCreateProduct = asyncHandler(async (req, res) => {
  const images = req.files;

  if (!images || images.length === 0) {
    return res.status(400).json(new ApiResponse(400, null, 'No image(s) found', false));
  }

  const imageUrls = await uploadMultipleFiles(images);

  const {
    title,
    slug,
    description,
    categoryId,
    subCategoryId,
    breedId,
    brandId,
    variants,
    price,
    salePrice,
    stock,
    isActive = true,
    isFeatured = false,
    tags,
    attributes,
    ratings
  } = req.body;

  if (!title || !slug) {
    return res.status(400).json(new ApiResponse(400, null, 'Title and slug are required', false));
  }

  // Parse fields that may come as strings but are actually arrays or objects
  const parsedBreedIds = typeof breedId === 'string' ? JSON.parse(breedId) : breedId;
const parsedVariants = typeof variants === 'string' ? JSON.parse(variants) : variants;
const parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
const parsedAttributes = typeof attributes === 'string' ? JSON.parse(attributes) : attributes;
const parsedRatings = typeof ratings === 'string' ? JSON.parse(ratings) : ratings;


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
    isFeatured,
    images: imageUrls,
  variants: parsedVariants,
  tags: parsedTags,
  attributes: parsedAttributes,
  ratings: parsedRatings,
  };

  const result = await createProduct(productPayload);
  return res.status(201).json(new ApiResponse(201, result, 'Product created successfully', true));
});


exports.handleGetAllProducts = asyncHandler(async (req, res) => {
    const { search, page = 1, per_page = 50, start_date, end_date } = req.query;
    const result = await getAllProducts({ search, page, perPage: per_page, startDate: start_date, endDate: end_date });
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