const ApiResponse = require('../../../utils/apiResponse');
const { asyncHandler } = require('../../../utils/asyncHandler');
const {
  createProductBanner,
  getProductBanner,
  updateProductBanner,
} = require('../../../services/configuration/productBanner/index');

exports.handleCreateProductBanner = asyncHandler(async (req, res) => {
  const { productId, type } = req.body;
  const image = req.file.path;
  const productBanner = await createProductBanner(productId, image, type);
  if (productBanner.success === false) {
    return res
      .status(productBanner.statusCode)
      .json(new ApiResponse(productBanner.statusCode, null, productBanner.message, null));
  }
  return res
    .status(201)
    .json(new ApiResponse(201, productBanner, 'Product banner created successfully', null));
});

exports.handleGetProductBanner = asyncHandler(async (req, res) => {
  const { type } = req.query;
  const productBanner = await getProductBanner(type);
  if (productBanner.success === false) {
    return res
      .status(productBanner.statusCode)
      .json(new ApiResponse(productBanner.statusCode, null, productBanner.message, null));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, productBanner, 'Product banner fetched successfully', null));
});

exports.handleUpdateProductBanner = asyncHandler(async (req, res) => {
  const { productId, type, isActive } = req.body;
  const image = req.file.path;
  const productBanner = await updateProductBanner(productId, image, type, isActive);
  if (productBanner.success === false) {
    return res
      .status(productBanner.statusCode)
      .json(new ApiResponse(productBanner.statusCode, null, productBanner.message, null));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, productBanner, 'Product banner updated successfully', null));
});
