const {
   addressService,
   updateAddressService,
   deleteAddressService,
   getAllSavedAddresses,
} = require('../../services/address');
const ApiResponse = require('../../utils/apiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');

exports.handleCreateAddress = asyncHandler(async (req, res) => {
   const user = req.user;
   const result = await addressService(user, req.body);

   if (!result.success) {
      return res.status(400).json(new ApiResponse(400, null, result.message, false));
   }
   return res
      .status(201)
      .json(new ApiResponse(201, result.data, 'Address created successfully', true));
});

exports.handleUpdateAddress = asyncHandler(async (req, res) => {
   const user = req.user;
   const { id } = req.params;
   const result = await updateAddressService(user, req.body, id);

   if (!result.success) {
      return res.status(400).json(new ApiResponse(400, null, result.message, false));
   }
   return res
      .status(200)
      .json(new ApiResponse(200, result.data, 'Address updated successfully', true));
});

exports.handleDeleteAddress = asyncHandler(async (req, res) => {
   const user = req.user;
   const { id } = req.params;
   const result = await deleteAddressService(user, id);
   if (!result.success) {
      return res.status(400).json(new ApiResponse(400, null, result.message, false));
   }
   return res
      .status(200)
      .json(new ApiResponse(200, result.data, 'Address deleted successfully', true));
});

exports.handleGetAllSavedAddresses = asyncHandler(async (req, res) => {
   const user = req.user;
   const result = await getAllSavedAddresses(user._id);
   if (!result.success) {
      return res.status(400).json(new ApiResponse(400, null, result.message, false));
   }
   return res
      .status(200)
      .json(new ApiResponse(200, result.data, 'All saved addresses retrieved successfully', true));
});

exports.handleGetAllSavedAddressesAdmin = asyncHandler(async (req, res) => {
   const { id } = req.params;
   const result = await getAllSavedAddresses(id);
   if (!result.success) {
      return res.status(400).json(new ApiResponse(400, null, result.message, false));
   }
   return res
      .status(200)
      .json(new ApiResponse(200, result.data, 'All saved addresses retrieved successfully', true));
});
