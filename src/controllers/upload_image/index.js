const { uploadImage } = require('../../services/upload_image');
const ApiResponse = require('../../utils/apiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');

exports.handleUploadImage = asyncHandler(async (req, res) => {
   const image = req.file.path;
   const response = await uploadImage(image);
   if (!response.success) {
      return res
         .status(200)
         .json(new ApiResponse(response.status, response.data, response.message, response.success));
   }
   return res
      .status(200)
      .json(new ApiResponse(response.status, response.data, response.message, response.success));
});
