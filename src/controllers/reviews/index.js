const {
  createReview,
  getAllProductReviews,
  checkIfUserBoughtProduct,
} = require('../../services/reviews');
const ApiResponse = require('../../utils/apiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');

exports.handleCreateReview = asyncHandler(async (req, res) => {
  const { productId, review, rating } = req.body;
  const { _id } = req.user;

  const result = await createReview(productId, _id, review, rating);
  if (result.statusCode !== 200) {
    return res.status(200).json(new ApiResponse(result.statusCode, null, result.message));
  }
  return res.status(200).json(new ApiResponse(200, result.data, result.message));
});

exports.handleGetAllProductReviews = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { sortBy } = req.query;
  const result = await getAllProductReviews(id, sortBy);
  if (result.statusCode !== 200) {
    return res.status(200).json(new ApiResponse(result.statusCode, null, result.message));
  }
  return res.status(200).json(new ApiResponse(200, result.data, result.message));
});

exports.handleCheckIfUserBoughtProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { _id } = req.user;
  const result = await checkIfUserBoughtProduct(id, _id);
  if (result.statusCode !== 200) {
    return res.status(200).json(new ApiResponse(result.statusCode, null, result.message));
  }
  return res.status(200).json(new ApiResponse(200, result.data, result.message));
});
