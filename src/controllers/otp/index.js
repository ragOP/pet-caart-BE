const ApiResponse = require('../../utils/apiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const { sendOtp } = require('../../services/otp/index');

exports.sendOtp = asyncHandler(async (req, res) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber) {
    return res.status(400).json(new ApiResponse(400, null, 'Phone number is required'));
  }
  const result = await sendOtp(phoneNumber);
  if (result.success) {
    return res.status(200).json(new ApiResponse(200, result.data, result.message));
  }
  return res
    .status(result.statusCode)
    .json(new ApiResponse(result.statusCode, null, result.message));
});
