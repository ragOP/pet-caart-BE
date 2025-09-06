const {
  CreateNewHomeSection,
  GetAllGridConfig,
  GetOneGridConfig,
  DeleteGridConfig,
  UpdateGridConfig,
  UpdateGridConfigPosition
} = require('../../services/home_config');
const ApiResponse = require('../../utils/apiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');

exports.handleCreateNewHomeConfig = asyncHandler(async (req, res) => {
  const {
    title = '',
    contentType,
    contentItems = [],
    grid,
    isActive = false,
    position = 0,
    backgroundImage = '',
    bannerImage = '',
    mobileGrid,
    keyword = '',
  } = req.body;

  // Creating the home section record
  const response = await CreateNewHomeSection(
    title,
    contentType,
    contentItems,
    grid,
    isActive,
    position,
    backgroundImage,
    bannerImage,
    mobileGrid,
    keyword
  );

  if (!response.success) {
    return res
      .status(200)
      .json(
        new ApiResponse(response.statusCode, response.data, response.message, response.success)
      );
  }

  return res.status(200).json(new ApiResponse(200, response.data, response.message, true));
});

exports.handleGetAllGridConfig = asyncHandler(async (req, res) => {
  const { keyword } = req.query;
  const response = await GetAllGridConfig(keyword);
  if (!response.success) {
    return res
      .status(200)
      .json(
        new ApiResponse(response.statusCode, response.data, response.message, response.success)
      );
  }

  return res.status(200).json(new ApiResponse(200, response.data, response.message, true));
});

exports.handleGetOneGridConfig = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const response = await GetOneGridConfig(id);
  if (!response.success) {
    return res
      .status(200)
      .json(
        new ApiResponse(response.statusCode, response.data, response.message, response.success)
      );
  }

  return res.status(200).json(new ApiResponse(200, response.data, response.message, true));
});

exports.handleDeleteGridConfig = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const response = await DeleteGridConfig(id);
  if (!response.success) {
    return res
      .status(200)
      .json(
        new ApiResponse(response.statusCode, response.data, response.message, response.success)
      );
  }
  return res.status(200).json(new ApiResponse(200, response.data, response.message, true));
});

exports.handleUpdateGridConfig = asyncHandler(async (req, res) => {
  const {
    title = '',
    contentType,
    contentItems = [],
    grid,
    isActive = false,
    position = 0,
    backgroundImage = '',
    bannerImage = '',
    mobileGrid,
    keyword = '',
  } = req.body;

  const response = await UpdateGridConfig(
    req.params.id,
    title,
    contentType,
    contentItems,
    grid,
    isActive,
    position,
    backgroundImage,
    bannerImage,
    mobileGrid,
    keyword
  );

  if (!response.success) {
    return res
      .status(200)
      .json(
        new ApiResponse(response.statusCode, response.data, response.message, response.success)
      );
  }

  return res.status(200).json(new ApiResponse(200, response.data, response.message, true));
});

exports.handleUpdateGridConfigPosition = asyncHandler(async (req, res) => {
  const { newPosition, oldPosition } = req.body;

  const response = await UpdateGridConfigPosition(req.params.id, newPosition, oldPosition);
  if (!response.success) {
    return res
      .status(200)
      .json(
        new ApiResponse(response.statusCode, response.data, response.message, response.success)
      );
  }
  return res.status(200).json(new ApiResponse(200, response.data, response.message, true));
});
