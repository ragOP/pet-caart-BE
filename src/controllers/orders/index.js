const { createOrderService } = require('../../services/orders');
const ApiResponse = require('../../utils/apiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');

exports.createOrder = asyncHandler(async (req, res) => {
  const result = await createOrderService(req.body, req.user);

  if (!result.success) {
    return res
      .status(result.statusCode)
      .json(new ApiResponse(result.statusCode, result.message, result.data, false));
  }

  return res
    .status(result.statusCode)
    .json(new ApiResponse(result.statusCode, result.message, result.data, true));
});
