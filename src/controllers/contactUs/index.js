const { getAllContactUs, createContactUs, updateContactUs } = require('../../services/contactUs');
const ApiResponse = require('../../utils/apiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');

exports.handleContactUs = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;
  const contactUs = await createContactUs(name, email, message);
  if (!contactUs.success) {
    return res
      .status(contactUs.statusCode)
      .json(new ApiResponse(contactUs.statusCode, null, contactUs.message, false));
  }
  return res
    .status(contactUs.statusCode)
    .json(new ApiResponse(contactUs.statusCode, contactUs.data, contactUs.message, true));
});

exports.handleGetAllContactUs = asyncHandler(async (req, res) => {
  const contactUs = await getAllContactUs();
  if (!contactUs.success) {
    return res
      .status(contactUs.statusCode)
      .json(new ApiResponse(contactUs.statusCode, null, contactUs.message, false));
  }
  return res
    .status(contactUs.statusCode)
    .json(new ApiResponse(contactUs.statusCode, contactUs.data, contactUs.message, true));
});

exports.handleUpdateContactUs = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (req.body.responded === false) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, 'You cannot unrespond to a query', false));
  }
  const contactUs = await updateContactUs(id, req.body);
  if (!contactUs.success) {
    return res
      .status(contactUs.statusCode)
      .json(new ApiResponse(contactUs.statusCode, null, contactUs.message, false));
  }
  return res
    .status(contactUs.statusCode)
    .json(new ApiResponse(contactUs.statusCode, contactUs.data, contactUs.message, true));
});
