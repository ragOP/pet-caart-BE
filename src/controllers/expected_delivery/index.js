const finder = require('india-pincode-search');
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

   const pincode_with_state = finder.search(pincode);

   const addDays = (date, days) => {
      const result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
   };

   const formatDate = date =>
      date.toLocaleDateString('en-US', {
         month: 'short',
         day: 'numeric',
         year: 'numeric',
      });

   let estimatedDays = 0;
   if (
      pincode_with_state &&
      (pincode_with_state[0].district === 'Rajkot' || pincode_with_state[0].city === 'Rajkot')
   ) {
      estimatedDays = 0;
   } else {
      const etd = expectedDelivery.data.data.available_courier_companies[0].estimated_delivery_days;
      estimatedDays = Math.min(etd, 4);
   }

   const estimatedDate = addDays(new Date(), estimatedDays);
   const formatted = formatDate(estimatedDate);

   return res
      .status(200)
      .json(new ApiResponse(200, formatted, 'Expected delivery fetched successfully', true));
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
