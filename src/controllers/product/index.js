const { asyncHandler } = require('../../utils/asyncHandler/index');
const { uploadMultipleFiles } = require('../../utils/upload');
const {
   createProduct,
   getSingleProduct,
   getAllProducts,
   updateProduct,
   getRecommendedProducts,
   deleteProduct,
   getSingleProductBySlug,
} = require('../../services/product/index');
const ApiResponse = require('../../utils/apiResponse/index');

exports.handleCreateProduct = asyncHandler(async (req, res) => {
   const { images = [], variantImages = [], commonImages = [] } = req.files || {};

   // Upload only if files are provided
   const imageUrls = images.length ? await uploadMultipleFiles(images) : [];
   const uploadedVariantImages = variantImages.length
      ? await uploadMultipleFiles(variantImages)
      : [];
   const uploadedCommonImages = commonImages.length ? await uploadMultipleFiles(commonImages) : [];

   const {
      title,
      slug,
      description,
      categoryId,
      subCategoryId,
      productLabel,
      breedId,
      brandId,
      variants,
      variantImageMap,
      price,
      salePrice,
      sku,
      importedBy,
      countryOfOrigin,
      stock,
      isActive = true,
      isBestSeller = false,
      isVeg = false,
      lifeStage,
      breedSize,
      productType,
      tags,
      attributes,
      ratings,
      weight,
      isSpecialOffer = false,
   } = req.body;

   // Safe JSON parser utility
   const safeJSONParse = (val, fallback = []) => {
      try {
         return typeof val === 'string' ? JSON.parse(val) : val || fallback;
      } catch {
         return fallback;
      }
   };

   // Parse variants safely
   let parsedVariantsRaw = safeJSONParse(variants, []);
   parsedVariantsRaw = Array.isArray(parsedVariantsRaw)
      ? parsedVariantsRaw
      : [parsedVariantsRaw].filter(Boolean);

   // Parse other optional arrays safely
   const parsedBreedIds = safeJSONParse(breedId, []);
   const parsedTags = safeJSONParse(tags, []);
   const parsedAttributes = safeJSONParse(attributes, []);
   const parsedRatings = safeJSONParse(ratings, []);
   const parsedVariantImageMap = safeJSONParse(variantImageMap, []);

   // Ensure parsedVariants are proper objects
   const parsedVariants = parsedVariantsRaw.map(v => (typeof v === 'string' ? JSON.parse(v) : v));

   // Enrich variants with images
   let enrichedVariants = [];
   if (
      parsedVariants.length > 0 ||
      (uploadedVariantImages.length > 0 && parsedVariantImageMap.length > 0)
   ) {
      const variantImageGroups = {};

      parsedVariantImageMap.forEach((item, idx) => {
         const index = item.index;
         if (!variantImageGroups[index]) variantImageGroups[index] = [];
         variantImageGroups[index].push(uploadedVariantImages[idx]);
      });

      enrichedVariants = parsedVariants.map((variant, index) => ({
         ...variant,
         images: variantImageGroups[index] || [],
      }));
   } else {
      enrichedVariants = parsedVariants;
   }

   // Construct product payload
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
      sku,
      importedBy,
      countryOfOrigin,
      productLabel,
      stock,
      isActive: isActive === 'true' || isActive === true,
      isVeg: isVeg === 'true' || isVeg === true,
      isBestSeller: isBestSeller === 'true' || isBestSeller === true,
      lifeStage,
      breedSize,
      productType,
      images: imageUrls,
      commonImages: uploadedCommonImages,
      variants: enrichedVariants,
      tags: parsedTags,
      attributes: parsedAttributes,
      ratings: parsedRatings,
      weight,
      isSpecialOffer: isSpecialOffer === 'true' || isSpecialOffer === true,
   };

   const result = await createProduct(productPayload);

   return res
      .status(200)
      .json(new ApiResponse(result.statusCode, result, result.message, result.success));
});

exports.handleGetAllProducts = asyncHandler(async (req, res) => {
   const {
      search,
      page = 1,
      per_page = 50,
      start_date,
      end_date,
      max_price,
      isBestSeller,
      isVeg,
      lifeStage,
      breedSize,
      productType,
      categorySlug,
      subCategorySlug,
      brandSlug,
      breedSlug,
      min_price_range,
      max_price_range,
      sort_by,
      rating,
      collectionSlug,
      isSpecialOffer = false,
   } = req.query;
   const result = await getAllProducts({
      search,
      page,
      perPage: per_page,
      startDate: start_date,
      endDate: end_date,
      maxPrice: max_price,
      isVeg,
      lifeStage,
      breedSize,
      productType,
      isBestSeller,
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
   return res
      .status(200)
      .json(new ApiResponse(result.statusCode, result, result.message, result.success));
});

exports.handleGetSingleProduct = asyncHandler(async (req, res) => {
   const { id } = req.params;
   if (!id) {
      return res.status(400).json(new ApiResponse(400, null, 'Product id is required'));
   }
   const result = await getSingleProduct(id);
   return res
      .status(200)
      .json(new ApiResponse(result.statusCode, result.data, result.message, result.success));
});

exports.handleUpdateProduct = asyncHandler(async (req, res) => {
   const { id } = req.params;
   const { body } = req;
   const { images = [], variantImages = [], commonImages = [] } = req.files || {};

   // Upload files safely
   const imageUrls = images.length ? await uploadMultipleFiles(images) : [];
   const uploadedVariantImages = variantImages.length
      ? await uploadMultipleFiles(variantImages)
      : [];
   const uploadedCommonImages = commonImages.length ? await uploadMultipleFiles(commonImages) : [];

   body.images = imageUrls;
   body.commonImages = uploadedCommonImages;

   // Safe JSON parse helper
   const safeJSONParse = (val, fallback = []) => {
      try {
         return typeof val === 'string' ? JSON.parse(val) : val || fallback;
      } catch {
         return fallback;
      }
   };

   // Parse variants safely
   let parsedVariantsRaw = body.variants ? safeJSONParse(body.variants, []) : [];
   parsedVariantsRaw = Array.isArray(parsedVariantsRaw)
      ? parsedVariantsRaw
      : [parsedVariantsRaw].filter(Boolean);

   // Ensure variants are proper objects
   const parsedVariants = parsedVariantsRaw.map(v => (typeof v === 'string' ? JSON.parse(v) : v));

   // Parse other optional arrays safely
   const parsedBreedIds = safeJSONParse(body.breedId, []);
   const parsedTags = safeJSONParse(body.tags, []);
   const parsedAttributes = safeJSONParse(body.attributes, []);
   const parsedRatings = safeJSONParse(body.ratings, []);
   const parsedVariantImageMap = safeJSONParse(body.variantImageMap, []);

   // Enrich variants with images
   let enrichedVariants = [];
   if (
      parsedVariants.length > 0 &&
      uploadedVariantImages.length > 0 &&
      parsedVariantImageMap.length > 0
   ) {
      const variantImageGroups = {};
      parsedVariantImageMap.forEach((item, idx) => {
         const index = item.index;
         if (!variantImageGroups[index]) variantImageGroups[index] = [];
         variantImageGroups[index].push(uploadedVariantImages[idx]);
      });

      enrichedVariants = parsedVariants.map((variant, index) => ({
         ...variant,
         images: variantImageGroups[index] || [],
      }));
   } else {
      enrichedVariants = parsedVariants;
   }
   // Construct product payload
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
      productLabel: body.productLabel,
      sku: body.sku,
      importedBy: body.importedBy,
      countryOfOrigin: body.countryOfOrigin,
      stock: body.stock,
      isActive: body.isActive,
      isVeg: body.isVeg === 'true' || body.isVeg === true,
      isBestSeller: body.isBestSeller === 'true' || body.isBestSeller === true,
      lifeStage: body.lifeStage,
      breedSize: body.breedSize,
      productType: body.productType,
      images: imageUrls,
      commonImages: uploadedCommonImages,
      variants: enrichedVariants,
      tags: parsedTags,
      attributes: parsedAttributes,
      ratings: parsedRatings,
      weight: body.weight,
      isSpecialOffer: body.isSpecialOffer === 'true' || body.isSpecialOffer === true,
   };

   // Update product
   const result = await updateProduct(id, productPayload);
   if (!result) {
      return res.status(404).json(new ApiResponse(404, null, 'Product not found'));
   }

   return res
      .status(200)
      .json(new ApiResponse(result.statusCode, result, result.message, result.success));
});

exports.handleGetRecommendedProducts = asyncHandler(async (req, res) => {
   const { id } = req.params;
   const { type } = req.query;
   if (!id) {
      return res.status(400).json(new ApiResponse(400, null, 'Product id is required'));
   }
   const result = await getRecommendedProducts(id, type);
   return res
      .status(200)
      .json(new ApiResponse(result.statusCode, result.data, result.message, result.success));
});

exports.handleDeleteProduct = asyncHandler(async (req, res) => {
   const { id } = req.params;
   if (!id) {
      return res.status(400).json(new ApiResponse(400, null, 'Product id is required'));
   }
   const result = await deleteProduct(id);
   if (!result) {
      return res.status(404).json(new ApiResponse(404, null, 'Product not found'));
   }
   return res
      .status(200)
      .json(new ApiResponse(result.statusCode, result.data, result.message, result.success));
});

exports.handleGetSingleProductBySlug = asyncHandler(async (req, res) => {
   const { slug } = req.params;
   if (!slug) {
      return res.status(400).json(new ApiResponse(400, null, 'Product slug is required'));
   }
   const result = await getSingleProductBySlug(slug);
   if (!result) {
      return res.status(404).json(new ApiResponse(404, null, 'Product not found'));
   }
   return res
      .status(200)
      .json(new ApiResponse(result.statusCode, result.data, result.message, result.success));
});

exports.handleGetSpecialOffersProducts = asyncHandler(async (req, res) => {
   const { search, page = 1, per_page = 50 } = req.query;

   const result = await getAllProducts({
      search,
      page,
      perPage: per_page,
      isSpecialOffer: true,
   });

   if (!result.success) {
      return res.status(200).json(new ApiResponse(result.statusCode, null, result.message, false));
   }
   return res
      .status(200)
      .json(new ApiResponse(result.statusCode, result.data, result.message, true));
});
