const {
   createSlider,
   getSlider,
   updateSlider,
   getSliderById,
   deleteSlider,
   getAllSlider,
} = require('../../../services/configuration/sliders');
const { asyncHandler } = require('../../../utils/asyncHandler');
const ApiResponse = require('../../../utils/apiResponse/index');

exports.handleCreateSlider = asyncHandler(async (req, res) => {
   const image = req.file;
   const { link, isActive, type } = req.body;
   const result = await createSlider(image, link, isActive, type);
   if (!result.success) {
      return res.status(400).json(new ApiResponse(400, null, result.message, false));
   }
   return res.status(201).json(new ApiResponse(201, result, 'Slider created successfully', true));
});

exports.handleGetSlider = asyncHandler(async (req, res) => {
   const { type } = req.query;
   const result = await getSlider(type);
   if (!result.success) {
      return res.status(400).json(new ApiResponse(400, null, result.message, false));
   }
   return res.status(200).json(new ApiResponse(200, result, 'Slider fetched successfully', true));
});

exports.handleUpdateSlider = asyncHandler(async (req, res) => {
   const { id } = req.params;
   const image = req.file;
   console.log(req.body, image, id);
   const result = await updateSlider(req.body, image, id);
   if (!result.success) {
      return res.status(400).json(new ApiResponse(400, null, result.message, false));
   }
   return res.status(200).json(new ApiResponse(200, result, 'Slider updated successfully', true));
});

exports.handleGetSliderById = asyncHandler(async (req, res) => {
   const { id } = req.params;
   const result = await getSliderById(id);
   if (!result.success) {
      return res.status(400).json(new ApiResponse(400, null, result.message, false));
   }
   return res.status(200).json(new ApiResponse(200, result, 'Slider fetched successfully', true));
});

exports.handleDeleteSlider = asyncHandler(async (req, res) => {
   const { id } = req.params;
   const result = await deleteSlider(id);
   if (!result.success) {
      return res.status(400).json(new ApiResponse(400, null, result.message, false));
   }
   return res.status(200).json(new ApiResponse(200, result, 'Slider deleted successfully', true));
});

exports.handleGetAllSlider = asyncHandler(async (req, res) => {
   const { type } = req.query;
   const result = await getAllSlider(type);
   if (!result.success) {
      return res.status(400).json(new ApiResponse(400, null, result.message, false));
   }
   return res.status(200).json(new ApiResponse(200, result, 'Slider fetched successfully', true));
});
