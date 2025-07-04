const {
  createOrderService,
  getOrderByIdService,
  getAllUserOrdersService,
  getAllOrdersService,
  getOrderByIdServiceAdmin,
  updateOrderStatusService,
} = require('../../services/orders');
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

exports.getOrderById = asyncHandler(async (req, res) => {
  const result = await getOrderByIdService(req.params.id, req.user);
  if (!result.success) {
    return res
      .status(result.statusCode)
      .json(new ApiResponse(result.statusCode, result.message, result.data, false));
  }
  return res
    .status(result.statusCode)
    .json(new ApiResponse(result.statusCode, result.message, result.data, true));
});

exports.getAllUserOrders = asyncHandler(async (req, res) => {
  const result = await getAllUserOrdersService(req.user);
  if (!result.success) {
    return res
      .status(result.statusCode)
      .json(new ApiResponse(result.statusCode, result.message, result.data, false));
  }
  return res
    .status(result.statusCode)
    .json(new ApiResponse(result.statusCode, result.message, result.data, true));
});
exports.getAllOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 25, search, sort, order, status, startDate, endDate } = req.query;
  const result = await getAllOrdersService(
    page,
    limit,
    search,
    sort,
    order,
    status,
    startDate,
    endDate
  );
  if (!result.success) {
    return res
      .status(result.statusCode)
      .json(new ApiResponse(result.statusCode, result.message, result.data, false));
  }
  return res
    .status(result.statusCode)
    .json(new ApiResponse(result.statusCode, result.message, result.data, true));
});

exports.getOrderByIdAdmin = asyncHandler(async (req, res) => {
  const result = await getOrderByIdServiceAdmin(req.params.id);
  if (!result.success) {
    return res
      .status(result.statusCode)
      .json(new ApiResponse(result.statusCode, result.message, result.data, false));
  }
  return res
    .status(result.statusCode)
    .json(new ApiResponse(result.statusCode, result.message, result.data, true));
});

exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const result = await updateOrderStatusService(req.params.id, req.body);
  if (!result.success) {
    return res
      .status(result.statusCode)
      .json(new ApiResponse(result.statusCode, result.message, result.data, false));
  }
  return res
    .status(result.statusCode)
    .json(new ApiResponse(result.statusCode, result.message, result.data, true));
});
