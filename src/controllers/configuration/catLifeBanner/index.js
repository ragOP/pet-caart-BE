const {
   createCatLifeBanner,
   getCatLifeBanners,
   updateCatLifeBanner,
   getCatLifeBannerById,
} = require('../../../services/configuration/catLifeBanner/index.js');
const ApiResponse = require('../../../utils/apiResponse/index.js');
const { asyncHandler } = require('../../../utils/asyncHandler/index.js');

exports.handleCreateCatLifeBanner = asyncHandler(async (req, res) => {
   const { title, link } = req.body;
   const image = req.file.path;
   const result = await createCatLifeBanner(title, link, image);
   if (!result.success) {
      return res.status(400).json(new ApiResponse(400, null, result.message, false));
   }
   return res
      .status(200)
      .json(new ApiResponse(200, result, 'Cat life banner created successfully', true));
});

exports.handleGetCatLifeBanners = asyncHandler(async (req, res) => {
   const result = await getCatLifeBanners();
   if (!result.success) {
      return res.status(400).json(new ApiResponse(400, null, result.message, false));
   }
   return res
      .status(200)
      .json(new ApiResponse(200, result, 'Cat life banners fetched successfully', true));
});

exports.handleUpdateCatLifeBanner = asyncHandler(async (req, res) => {
   const { id } = req.params;
   const { title, link } = req.body;
   const image = req.file ? req.file.path : null;
   const result = await updateCatLifeBanner(id, title, link, image);
   if (!result.success) {
      return res.status(400).json(new ApiResponse(400, null, result.message, false));
   }
   return res
      .status(200)
      .json(new ApiResponse(200, result, 'Cat life banner updated successfully', true));
});

exports.handleGetCatLifeBannerById = asyncHandler(async (req, res) => {
   const { id } = req.params;
   const result = await getCatLifeBannerById(id);
   if (!result.success) {
      return res.status(400).json(new ApiResponse(400, null, result.message, false));
   }
   return res
      .status(200)
      .json(new ApiResponse(200, result, 'Cat life banner fetched successfully', true));
});
