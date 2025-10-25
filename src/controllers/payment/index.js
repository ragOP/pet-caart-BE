const ApiResponse = require('../../utils/apiResponse');
const { createPaymentService } = require('../../services/payment/index');
const { asyncHandler } = require('../../utils/asyncHandler');

exports.createPayment = asyncHandler(async (req, res) => {
   req.body.isUsingWalletAmount = req.query.isUsingWalletAmount === 'true';
   const result = await createPaymentService(req.body, req.user, req.body.isUsingWalletAmount);

   if (!result.success) {
      return res
         .status(result.statusCode)
         .json(new ApiResponse(result.statusCode, result.data, result.message, false));
   }

   return res
      .status(result.statusCode)
      .json(new ApiResponse(result.statusCode, result.data, result.message, true));
});
