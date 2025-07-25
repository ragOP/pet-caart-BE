const { asyncHandler } = require('../../utils/asyncHandler');
const BlogFeaturedProduct = require('../../models/blogFeaturedProduct');
const ApiResponse = require('../../utils/apiResponse');
const { uploadSingleFile } = require('../../utils/upload');

exports.handleCreateBlogFeaturedProduct = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const existingProduct = await BlogFeaturedProduct.findOne({ productId });
  if (existingProduct) {
    return res.status(400).json(new ApiResponse(400, 'Product already exists', null, false));
  }

  let bannerUrl = null;
  const bannerImage = req.file ? req.file.path : null;
  if (bannerImage) {
    bannerUrl = await uploadSingleFile(bannerImage);
  }

  const blogFeaturedProduct = await BlogFeaturedProduct.create({
    productId,
    bannerImage: bannerUrl,
  });
  return res
    .status(201)
    .json(
      new ApiResponse(201, 'Blog featured product created successfully', blogFeaturedProduct, true)
    );
});

exports.handleGetFeaturedProducts = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const blogFeaturedProduct = await BlogFeaturedProduct.findById(id).populate('productId');
  return res
    .status(200)
    .json(
      new ApiResponse(200, 'Blog featured product fetched successfully', blogFeaturedProduct, true)
    );
});

exports.handleDeleteFeaturedProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await BlogFeaturedProduct.findByIdAndDelete(id);
  return res
    .status(200)
    .json(new ApiResponse(200, 'Blog featured product deleted successfully', null, true));
});

exports.handleUpdateFeaturedProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { productId } = req.body;
  const bannerImage = req.file ? req.file.path : null;

  let bannerUrl = null;
  if (bannerImage) {
    bannerUrl = await uploadSingleFile(bannerImage);
  }

  const blogFeaturedProduct = await BlogFeaturedProduct.findByIdAndUpdate(
    id,
    { productId, bannerImage: bannerUrl },
    { new: true }
  );
  return res
    .status(200)
    .json(
      new ApiResponse(200, 'Blog featured product updated successfully', blogFeaturedProduct, true)
    );
});
