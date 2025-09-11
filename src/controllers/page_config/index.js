const ApiResponse = require('../../utils/apiResponse');
const {
   CreateNewPageConfig,
   GetAllPageConfigs,
   GetGridByKey,
   UpdatePageConfig,
} = require('../../services/page_config');
const { asyncHandler } = require('../../utils/asyncHandler');

exports.handleCreateNewPageConfig = asyncHandler(async (req, res) => {
   const { pageKey, sections } = req.body;

   const response = await CreateNewPageConfig(pageKey, sections);

   if (!response.success) {
      return res
         .status(200)
         .json(
            new ApiResponse(response.successCode, response.data, response.message, response.success)
         );
   }

   return res
      .status(201)
      .json(
         new ApiResponse(response.successCode, response.data, response.message, response.success)
      );
});

exports.handleUpdatePageConfig = asyncHandler(async (req, res) => {
   const { sections } = req.body;
   const { id } = req.params;

   const response = await UpdatePageConfig(id, sections);

   if (!response.success) {
      return res
         .status(200)
         .json(
            new ApiResponse(response.successCode, response.data, response.message, response.success)
         );
   }
   return res
      .status(200)
      .json(
         new ApiResponse(response.successCode, response.data, response.message, response.success)
      );
});

exports.handleGetAllGridConfigs = asyncHandler(async (req, res) => {
   const response = await GetAllPageConfigs();
   if (!response.success) {
      return res
         .status(200)
         .json(
            new ApiResponse(response.successCode, response.data, response.message, response.success)
         );
   }
   return res
      .status(200)
      .json(
         new ApiResponse(response.successCode, response.data, response.message, response.success)
      );
});

exports.handleGetGridByKey = asyncHandler(async (req, res) => {
   const { pageKey } = req.params;
   const response = await GetGridByKey(pageKey);
   if (!response.success) {
      return res
         .status(200)
         .json(
            new ApiResponse(response.successCode, response.data, response.message, response.success)
         );
   }
   return res
      .status(200)
      .json(
         new ApiResponse(response.successCode, response.data, response.message, response.success)
      );
});
