const { registerUser, loginUser } = require('../../../services/auth/user/index');
const { asyncHandler } = require('../../../utils/asyncHandler');
const ApiResponse = require('../../../utils/apiResponse/index');

exports.handleUserRegister = asyncHandler(async (req, res) => {
  const { phoneNumber, otp } = req.body;

  if (!phoneNumber || !otp) {
    return res.status(400).json(new ApiResponse(400, null, 'Phone number and OTP are required'));
  }

  const result = await registerUser(phoneNumber, otp);
  const { statusCode, message, data } = result;

  return res.status(statusCode).json(new ApiResponse(statusCode, data, message));
});

exports.handleUserLogin = asyncHandler(async (req, res) => {
  const { phoneNumber, otp } = req.body;

  if (!phoneNumber || !otp) {
    return res.status(400).json(new ApiResponse(400, null, 'Phone number and OTP are required'));
  }

  const result = await loginUser(phoneNumber, otp);
  const { statusCode, message, data } = result;

  return res.status(statusCode).json(new ApiResponse(statusCode, data, message));
});
