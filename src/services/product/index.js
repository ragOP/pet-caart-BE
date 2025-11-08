const { default: mongoose } = require('mongoose');
const collectionModel = require('../../models/collectionModel.js');
const variantModel = require('../../models/variantModel.js');
const {
   createProduct,
   getSingleProduct,
   getAllProducts,
   updateProduct,
   findProductBySKU,
   getProductBySlug,
} = require('../../repositories/product/index.js');
const {
   createManyVariants,
   updateManyVariants,
   deleteVariantsByIds,
} = require('../../repositories/variant/index.js');
const { handleGenerateSlug } = require('../../utils/generate_slug/index.js');

exports.createProduct = async productPayload => {
   const { variants, ...productData } = productPayload;

   // Checking for existing SKU
   const checkExistingSku = await findProductBySKU(productData.sku);

   if (checkExistingSku) {
      return {
         statusCode: 400,
         success: false,
         message: 'SKU already exists',
         data: null,
      };
   }

   // Additional Layer to ensure that slugs are always unique
   productData.slug = await handleGenerateSlug(productData.slug);

   // Create Product if everything is fine
   const product = await createProduct(productData);
   if (!product) {
      return {
         statusCode: 500,
         success: false,
         message: 'Failed to create product',
         data: null,
      };
   }

   let createdVariants = [];

   if (Array.isArray(variants) && variants.length > 0) {
      // Step 2: Add productId to each variant
      const enrichedVariants = variants.map(variant => ({
         ...variant,
         productId: product._id,
      }));
      // Step 3: Bulk insert variants
      createdVariants = await createManyVariants(enrichedVariants);
      if (createdVariants.length === 0) {
         return {
            statusCode: 500,
            success: false,
            message: 'Failed to create product variants',
            data: null,
         };
      }
   }

   return {
      data: {
         product,
         variants: createdVariants,
      },
      message: 'Product created successfully',
      statusCode: 201,
      success: true,
   };
};

exports.getSingleProduct = async id => {
   // const product = await getProductBySlug(id);
   const product = await getSingleProduct(id);
   if (!product) {
      return {
         statusCode: 404,
         success: false,
         message: 'Product not found',
         data: null,
      };
   }
   const variants = await variantModel.find({ productId: product._id });
   const updatedProductWithVariants = {
      ...product._doc,
      variants,
   };
   return {
      statusCode: 200,
      success: true,
      message: 'Product fetched successfully',
      data: updatedProductWithVariants,
   };
};

exports.getAllProducts = async ({
   search,
   page,
   perPage,
   startDate,
   endDate,
   maxPrice,
   isVeg,
   lifeStage,
   breedSize,
   productType,
   isBestSeller,
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
      const searchWords = search.trim().split(/\s+/);
      filters.$and = searchWords.map(word => ({
         $or: [
            { name: { $regex: word, $options: 'i' } },
            { slug: { $regex: word, $options: 'i' } },
         ],
      }));
   }

   if (startDate || endDate) {
      filters.createdAt = {};
      if (startDate) filters.createdAt.$gte = new Date(startDate);
      if (endDate) filters.createdAt.$lte = new Date(endDate);
   }

   if (maxPrice) {
      filters.price = { $lt: maxPrice };
   }

   if (isVeg) {
      filters.isVeg = isVeg;
   }

   if (lifeStage) {
      filters.lifeStage = lifeStage;
   }

   if (breedSize) {
      filters.breedSize = breedSize;
   }

   if (productType) {
      filters.productType = productType;
   }

   if (isBestSeller) {
      filters.isBestSeller = isBestSeller;
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
      message: 'Products fetched successfully',
      statusCode: 200,
      success: true,
   };
};

exports.updateProduct = async (id, productPayload) => {
   const { variants, ...productData } = productPayload;

   // Update Product if everything is fine
   const product = await updateProduct(id, productData);

   if (!product) {
      return {
         statusCode: 404,
         success: false,
         message: 'Product not found',
         data: null,
      };
   }

   if (Array.isArray(variants)) {
      // 1. Fetch current variants from DB
      const availableVariants = await variantModel.find({ productId: id });

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
         updatedVariantDocs = await updateManyVariants(updatedVariants, availableVariants);
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

exports.getRecommendedProducts = async (id, type = 'similar') => {
   const product = await getSingleProduct(id);
   if (!product) {
      return {
         statusCode: 404,
         success: false,
         message: 'Product not found',
         data: null,
      };
   }

   // Fetch candidate products from the same category (excluding current one)
   const candidates = await getAllProducts({
      categoryId: product.categoryId,
      _id: { $ne: product._id },
      isActive: true,
   });

   if (!candidates || candidates.total === 0) {
      return {
         statusCode: 200,
         success: true,
         message: 'No recommended products found',
         data: [],
      };
   }

   // Preprocess product attributes
   const productCategory = product.categoryId?.toString() || null;
   const productSubCategory = product.subCategoryId?.toString() || null;
   const productBrand = product.brandId?.toString() || null;
   const productBreeds = new Set((product.breedId || []).map(id => id.toString()));
   const productPrice = Number(product.price) || 0;

   const scoredProducts = candidates.products.map(candidate => {
      let score = 0;

      const candidateCategory = candidate.categoryId?.toString() || null;
      const candidateSubCategory = candidate.subCategoryId?.toString() || null;
      const candidateBrand = candidate.brandId?.toString() || null;
      const candidateBreeds = new Set((candidate.breedId || []).map(id => id.toString()));
      const candidatePrice = Number(candidate.price) || 0;

      // Step 1: Shared category
      if (candidateCategory === productCategory) score += 30;

      // Step 2: Subcategory logic
      if (type === 'similar') {
         // Prefer same subcategory
         if (candidateSubCategory === productSubCategory) score += 20;
      } else if (type === 'related') {
         // Prefer different subcategory
         if (candidateSubCategory !== productSubCategory) score += 10;
      }

      // Step 3: Shared brand
      if (candidateBrand === productBrand) score += 15;

      // Step 4: Match type, life stage, breed size
      if (candidate.productType === product.productType) score += 10;
      if (candidate.lifeStage === product.lifeStage) score += 5;
      if (candidate.breedSize === product.breedSize) score += 5;

      // Step 5: Veg/Non-Veg
      if (candidate.isVeg === product.isVeg) score += 3;

      // Step 6: Breed overlap (Set-based O(n))
      let sharedBreeds = 0;
      for (const id of candidateBreeds) {
         if (productBreeds.has(id)) sharedBreeds++;
      }
      score += sharedBreeds * 2;

      // Step 7: Price proximity (within ±20%)
      if (type === 'similar' && productPrice > 0) {
         const lower = productPrice * 0.8;
         const upper = productPrice * 1.2;
         if (candidatePrice >= lower && candidatePrice <= upper) score += 5;
      }

      return { product: candidate, score };
   });

   // Sort by descending score
   const sortedByScore = scoredProducts.sort((a, b) => b.score - a.score);

   // Pick top 12
   const topRecommended = sortedByScore.slice(0, 12).map(item => item.product);

   return {
      statusCode: 200,
      success: true,
      message: `Recommended (${type}) products fetched successfully`,
      data: topRecommended,
   };
};

exports.deleteProduct = async id => {
   // Started a session for transaction
   const session = await mongoose.startSession();
   session.startTransaction();

   const product = await getSingleProduct(id);
   if (!product) {
      await session.abortTransaction();
      session.endSession();
      return {
         statusCode: 404,
         success: false,
         message: 'Product not found',
         data: null,
      };
   }
   // Delete associated variants
   await variantModel.deleteMany({ productId: id }, { session });
   // remove the product from any collections
   await collectionModel.updateMany({ productIds: id }, { $pull: { productIds: id } }, { session });
   // Delete the product
   await product.deleteOne({ session });
   // Commit the transaction
   await session.commitTransaction();
   session.endSession();
   return {
      statusCode: 200,
      success: true,
      message: 'Product and associated variants deleted successfully',
      data: null,
   };
};

exports.getSingleProductBySlug = async slug => {
   const product = await getProductBySlug(slug);
   if (!product) {
      return {
         statusCode: 404,
         success: false,
         message: 'Product not found',
         data: null,
      };
   }
   const variants = await variantModel.find({ productId: product._id });
   const updatedProductWithVariants = {
      ...product._doc,
      variants,
   };
   return {
      statusCode: 200,
      success: true,
      message: 'Product fetched successfully',
      data: updatedProductWithVariants,
   };
};
