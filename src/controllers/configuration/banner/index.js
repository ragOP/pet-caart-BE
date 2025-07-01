const ApiResponse = require('../../../utils/apiResponse/index');
const {
  createBanner,
  updateBanner,
  getBanner,
  createAdBanner,
  getAdBanner,
} = require('../../../services/configuration/banners');
const { asyncHandler } = require('../../../utils/asyncHandler');

exports.handleCreateBanner = asyncHandler(async (req, res) => {
  const { type } = req.body;
  const image = req.file;
  const result = await createBanner(type, image);
  if (!result.success) {
    return res.status(400).json(new ApiResponse(400, null, result.message, false));
  }
  return res.status(201).json(new ApiResponse(201, result, 'Banner created successfully', true));
});

exports.handleUpdateBanner = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { type } = req.body;
  const image = req.file;

  const result = await updateBanner(type, image, id);

  if (!result.success) {
    return res.status(400).json(new ApiResponse(400, null, result.message, false));
  }
  return res.status(200).json(new ApiResponse(200, result, 'Banner updated successfully', true));
});

exports.handleGetBanner = asyncHandler(async (req, res) => {
  const { type } = req.query;
  const result = await getBanner(type);
  if (!result.success) {
    return res.status(400).json(new ApiResponse(400, null, result.message, false));
  }
  return res.status(200).json(new ApiResponse(200, result, 'Banner fetched successfully', true));
});

exports.handleCreateAdBanner = asyncHandler(async (req, res) => {
  const { title, description, link, products } = req.body;
  const result = await createAdBanner(title, description, link, products);
  if (!result.success) {
    return res.status(400).json(new ApiResponse(400, null, result.message, false));
  }
  return res.status(200).json(new ApiResponse(200, result, 'Ad banner created successfully', true));
});

exports.handleGetAdBanner = asyncHandler(async (req, res) => {
  const result = await getAdBanner();
  if (!result.success) {
    return res.status(400).json(new ApiResponse(400, null, result.message, false));
  }
  return res.status(200).json(new ApiResponse(200, result, 'Ad banner fetched successfully', true));
});
