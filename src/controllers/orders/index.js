const {
   createOrderService,
   getOrderByIdService,
   getAllUserOrdersService,
   getAllOrdersService,
   getOrderByIdServiceAdmin,
   updateOrderStatusService,
   createShipRocketOrderService,
   addAwbInfoService,
} = require('../../services/orders');
const ApiResponse = require('../../utils/apiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');

exports.createOrder = asyncHandler(async (req, res) => {
   const { isUsingWalletAmount } = req.query;
   const useWallet = isUsingWalletAmount === 'true';
   const result = await createOrderService(req.body, req.user, useWallet);

   if (!result.success) {
      return res
         .status(200)
         .json(new ApiResponse(result.statusCode, result.data, result.message, false));
   }

   return res
      .status(200)
      .json(new ApiResponse(result.statusCode, result.data, result.message, true));
});

exports.getOrderById = asyncHandler(async (req, res) => {
   const result = await getOrderByIdService(req.params.id, req.user);
   if (!result.success) {
      return res
         .status(200)
         .json(new ApiResponse(result.statusCode, result.data, result.message, false));
   }
   return res
      .status(200)
      .json(new ApiResponse(result.statusCode, result.data, result.message, true));
});

exports.getAllUserOrders = asyncHandler(async (req, res) => {
   const result = await getAllUserOrdersService(req.user);
   if (!result.success) {
      return res
         .status(200)
         .json(new ApiResponse(result.statusCode, result.data, result.message, false));
   }
   return res
      .status(200)
      .json(new ApiResponse(result.statusCode, result.data, result.message, true));
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
         .status(200)
         .json(new ApiResponse(result.statusCode, result.data, result.message, false));
   }
   return res
      .status(200)
      .json(new ApiResponse(result.statusCode, result.data, result.message, true));
});

exports.getOrderByIdAdmin = asyncHandler(async (req, res) => {
   const result = await getOrderByIdServiceAdmin(req.params.id);
   if (!result.success) {
      return res
         .status(200)
         .json(new ApiResponse(result.statusCode, result.data, result.message, false));
   }
   return res
      .status(200)
      .json(new ApiResponse(result.statusCode, result.data, result.message, true));
});

exports.updateOrderStatus = asyncHandler(async (req, res) => {
   const result = await updateOrderStatusService(req.params.id, req.body);
   if (!result.success) {
      return res
         .status(200)
         .json(new ApiResponse(result.statusCode, result.data, result.message, false));
   }
   return res
      .status(200)
      .json(new ApiResponse(result.statusCode, result.data, result.message, true));
});

exports.createShipRocketOrder = asyncHandler(async (req, res) => {
   const { length, width, height } = req.body;
   const result = await createShipRocketOrderService(req.params.id, length, width, height);
   if (!result.success) {
      return res
         .status(200)
         .json(new ApiResponse(result.statusCode, result.data, result.message, false));
   }
   return res
      .status(200)
      .json(new ApiResponse(result.statusCode, result.data, result.message, true));
});

exports.handleAddAwbInfo = asyncHandler(async (req, res) => {
   const { id } = req.params;
   const { awbNumber } = req.body;
   const result = await addAwbInfoService(id, awbNumber);
   if (!result.success) {
      return res
         .status(200)
         .json(new ApiResponse(result.statusCode, result.data, result.message, false));
   }
   return res
      .status(200)
      .json(new ApiResponse(result.statusCode, result.data, result.message, true));
});
