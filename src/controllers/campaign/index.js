const {
   handleStartWhatsAppCampaign,
   handleStartEmailCampaign,
   handleStartAndriodPushNotificationCampaign,
   handleStartiOSPushNotificationCampaign,
   getAllCampaigns,
   getSingleCampaign,
} = require('../../services/send_notification');
const ApiResponse = require('../../utils/apiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');

const campaignHandlers = {
   whatsapp: {
      fn: handleStartWhatsAppCampaign,
      successMsg: 'WhatsApp campaign started successfully',
   },
   email: {
      fn: handleStartEmailCampaign,
      successMsg: 'Email campaign started successfully',
   },
   push_notification_andriod: {
      fn: handleStartAndriodPushNotificationCampaign,
      successMsg: 'Android push notification campaign started successfully',
   },
   push_notification_ios: {
      fn: handleStartiOSPushNotificationCampaign,
      successMsg: 'iOS push notification campaign started successfully',
   },
};

exports.handleStartCampaign = asyncHandler(async (req, res) => {
   const { campaignType } = req.body;
   const campaign = campaignHandlers[campaignType];

   if (!campaign) {
      return res.status(400).json(new ApiResponse(400, null, 'Invalid campaign type', false));
   }

   const result = await campaign.fn(req);

   if (!result.success) {
      return res.status(500).json(new ApiResponse(500, null, result.message, false));
   }

   return res.status(200).json(new ApiResponse(200, result.data, campaign.successMsg, true));
});

exports.handleGetAllCampaigns = asyncHandler(async (req, res) => {
   const result = await getAllCampaigns();
   if (!result.success) {
      return res.status(404).json(new ApiResponse(404, null, 'No campaigns found', false));
   }
   return res
      .status(200)
      .json(new ApiResponse(200, result.data, 'Campaigns fetched successfully', true));
});

exports.handleGetSingleCampaign = asyncHandler(async (req, res) => {
   const { id } = req.params;
   if (!id) {
      return res.status(400).json(new ApiResponse(400, null, 'Campaign id is required'));
   }
   const result = await getSingleCampaign(id);
   if (!result) {
      return res.status(404).json(new ApiResponse(404, null, 'Campaign not found', false));
   }
   return res
      .status(200)
      .json(new ApiResponse(200, result.data, 'Campaign fetched successfully', true));
});
