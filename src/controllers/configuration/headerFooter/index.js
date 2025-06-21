const { getHeaderFooter, createHeaderFooter } = require('../../../services/configuration/headerFooter');
const ApiResponse = require('../../../utils/apiResponse');
const { asyncHandler } = require('../../../utils/asyncHandler');

exports.handleGetHeaderFooter = asyncHandler(async (req, res) => {
  const result = await getHeaderFooter();
  if (!result.success) {
    return res.status(400).json(new ApiResponse(400, null, result.message, false));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, result, 'Header and footer fetched successfully', true));
});

exports.handleCreateHeaderFooter = asyncHandler(async (req, res) => {
  const { address, phone, email, facebook, instagram, twitter, linkedin, youtube } = req.body;
  const logo = req.file;
  const result = await createHeaderFooter(
    logo,
    address,
    phone,
    email,
    facebook,
    instagram,
    twitter,
    linkedin,
    youtube
  );
  if (!result.success) {
    return res.status(400).json(new ApiResponse(400, null, result.message, false));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, result, 'Header and footer created successfully', true));
});
