const { asyncHandler } = require('../../utils/asyncHandler');
const BlogFeaturedProduct = require('../../models/blogFeaturedProduct');
const ApiResponse = require('../../utils/apiResponse');
const { uploadSingleFile } = require('../../utils/upload');

exports.handleCreateBlogFeaturedProduct = asyncHandler(async (req, res) => {
   const { productIds } = req.body;

   const existingProduct = await BlogFeaturedProduct.findOne();
   if (existingProduct) {
      return res.status(400).json(new ApiResponse(400, null, 'Product already exists', false));
   }

   let bannerUrl = null;
   const bannerImage = req.file ? req.file.path : null;
   if (bannerImage) {
      bannerUrl = await uploadSingleFile(bannerImage);
   }

   const blogFeaturedProduct = await BlogFeaturedProduct.create({
      productIds: productIdsArray,
      bannerImage: bannerUrl,
   });
   return res
      .status(201)
      .json(
         new ApiResponse(
            201,
            blogFeaturedProduct,
            'Blog featured product created successfully',
            true
         )
      );
});

exports.handleGetFeaturedProducts = asyncHandler(async (req, res) => {
   const blogFeaturedProduct = await BlogFeaturedProduct.findOne({}).populate('productIds');
   return res
      .status(200)
      .json(
         new ApiResponse(
            200,
            blogFeaturedProduct,
            'Blog featured product fetched successfully',
            true
         )
      );
});

exports.handleDeleteFeaturedProduct = asyncHandler(async (req, res) => {
   const { id } = req.params;
   await BlogFeaturedProduct.findByIdAndDelete(id);
   return res
      .status(200)
      .json(new ApiResponse(200, null, 'Blog featured product deleted successfully', true));
});

exports.handleUpdateFeaturedProduct = asyncHandler(async (req, res) => {
   const { id } = req.params;
   const { productIds } = req.body;
   const bannerImage = req.file ? req.file.path : null;

   let bannerUrl = null;
   if (bannerImage) {
      bannerUrl = await uploadSingleFile(bannerImage);
   }
   const productIdsArray = productIds.split(',');

   const blogFeaturedProduct = await BlogFeaturedProduct.findByIdAndUpdate(
      id,
      { productIds: productIdsArray, bannerImage: bannerUrl },
      { new: true }
   );
   return res
      .status(200)
      .json(
         new ApiResponse(
            200,
            blogFeaturedProduct,
            'Blog featured product updated successfully',
            true
         )
      );
});
