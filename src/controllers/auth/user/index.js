const {
   registerUser,
   loginUser,
   getAllUsers,
   getUserById,
   updateUser,
   updateProfile,
   generateReferralCode,
} = require('../../../services/auth/user/index');
const { asyncHandler } = require('../../../utils/asyncHandler');
const ApiResponse = require('../../../utils/apiResponse/index');

// exports.handleUserRegister = asyncHandler(async (req, res) => {
//   const { phoneNumber, otp, fcmToken='', apnToken='' } = req.body;

//   if (!phoneNumber || !otp) {
//     return res.status(400).json(new ApiResponse(400, null, 'Phone number and OTP are required'));
//   }

//   const result = await registerUser(phoneNumber, otp, fcmToken, apnToken);
//   const { statusCode, message, data } = result;

//   return res.status(200).json(new ApiResponse(statusCode, data, message));
// });

exports.handleUserLogin = asyncHandler(async (req, res) => {
   const { phoneNumber, otp, fcmToken = '', apnToken = '' } = req.body;

   if (!phoneNumber || !otp) {
      return res.status(400).json(new ApiResponse(400, null, 'Phone number and OTP are required'));
   }

   const result = await loginUser(phoneNumber, otp, fcmToken, apnToken);
   const { statusCode, message, data } = result;

   return res.status(200).json(new ApiResponse(statusCode, data, message));
});

exports.handleAllUsers = asyncHandler(async (req, res) => {
   const { search, page = 1, per_page = 50, start_date, end_date } = req.query;
   const adminId = req.admin?._id;

   if (!adminId) {
      return res.status(403).json(new ApiResponse(403, null, 'Not authorized'));
   }

   const result = await getAllUsers({
      search,
      page,
      perPage: per_page,
      startDate: start_date,
      endDate: end_date,
   });

   return res.status(200).json(new ApiResponse(200, result, 'Users fetched successfully', true));
});

exports.handleGetUserById = asyncHandler(async (req, res) => {
   const { id } = req.params;
   if (!id) {
      return res.status(400).json(new ApiResponse(400, null, 'User ID is required', false));
   }
   const result = await getUserById(id);
   if (!result) {
      return res.status(404).json(new ApiResponse(404, null, 'User not found', false));
   }
   return res.status(200).json(new ApiResponse(200, result, 'User fetched successfully', true));
});

exports.handleUpdateUser = asyncHandler(async (req, res) => {
   const { id } = req.params;
   if (!id) {
      return res.status(400).json(new ApiResponse(400, null, 'User ID is required', false));
   }
   const result = await updateUser(id, req.body);
   if (!result) {
      return res.status(404).json(new ApiResponse(404, null, 'User not found', false));
   }
   return res.status(200).json(new ApiResponse(200, result, 'User updated successfully', true));
});

exports.handleUpdateProfile = asyncHandler(async (req, res) => {
   const user = req.user;
   const result = await updateProfile(user._id, req.body);
   if (!result) {
      return res.status(404).json(new ApiResponse(404, null, 'User not found', false));
   }
   return res
      .status(200)
      .json(new ApiResponse(200, result, 'User profile updated successfully', true));
});

exports.handleGenerateReferralCode = asyncHandler(async (req, res) => {
   const user = req.user;
   const result = await generateReferralCode(user._id);
   if (!result) {
      return res.status(404).json(new ApiResponse(404, null, 'User not found', false));
   }
   return res
      .status(200)
      .json(new ApiResponse(200, result.data, 'Referral code generated successfully', true));
});
