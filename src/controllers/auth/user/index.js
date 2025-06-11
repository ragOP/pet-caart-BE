const { registerUser, loginUser, getAllUsers } = require('../../../services/auth/user/index');
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

exports.handleAllUsers = asyncHandler(async (req, res) => {
  const { search, page = 1, per_page = 50, start_date, end_date } = req.query;
  const adminId = req.admin?._id;

  if (!adminId) {
    return res.status(403).json(new ApiResponse(403, null, "Not authorized"));
  }

  const result = await getAllUsers({
    search,
    page,
    perPage: per_page,
    startDate: start_date,
    endDate: end_date,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Users fetched successfully", true));
});
