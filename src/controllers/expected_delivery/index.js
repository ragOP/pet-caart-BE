const ApiResponse = require('../../utils/apiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const { getEstimatedPrice, trackDelivery } = require('../../utils/shipRocket');

exports.checkExpectedDelivery = asyncHandler(async (req, res) => {
  const { pincode } = req.body;

  const expectedDelivery = await getEstimatedPrice(pincode, 0.5);
  if (expectedDelivery.statusCode !== 200) {
    return res
      .status(200)
      .json(new ApiResponse(expectedDelivery.statusCode, null, expectedDelivery.message, false));
  }
  const finalData = expectedDelivery.data.data.available_courier_companies[0].etd;
  return res
    .status(200)
    .json(new ApiResponse(200, finalData, 'Expected delivery fetched successfully', true));
});

exports.handleTrackDelivery = asyncHandler(async (req, res) => {
  const { awbId } = req.body;
  const delivery = await trackDelivery(awbId);
  if (delivery.statusCode !== 200) {
    return res
      .status(200)
      .json(new ApiResponse(delivery.statusCode, null, delivery.message, false));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, delivery.data, 'Delivery tracked successfully', true));
});
