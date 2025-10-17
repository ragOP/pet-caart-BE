const campaignModel = require('../../models/campaignModel');
const userModel = require('../../models/userModel');
const { sendEmailReminder } = require('../../utils/generateOrderBill');
const { sendWhatsAppMessage } = require('../../utils/send_whatsapp_remainder');
const { sendPushNotification } = require('../../utils/send_notification');
const { sendViaAPNs } = require('../../utils/send_ios_notification');

const processCampaign = async ({
   req,
   channel,
   sendFn,
   contactField,
   campaignType,
   messagePayload,
}) => {
   const { userIds } = req.body;

   // Validation
   if (!userIds?.length) {
      return { success: false, message: 'No user IDs provided', data: null, statusCode: 400 };
   }

   const users = await userModel.find({ _id: { $in: userIds } });
   if (!users.length) {
      return {
         success: false,
         message: 'No users found for provided IDs',
         data: null,
         statusCode: 404,
      };
   }

   let successCount = 0;
   let failureCount = 0;
   const results = [];

   // Send message per user (sequentially or via Promise.all if needed)
   for (const user of users) {
      const contact = user[contactField];
      if (!contact) {
         failureCount++;
         results.push({ userId: user._id, success: false, error: `Missing ${contactField}` });
         continue;
      }

      try {
         const response = await sendFn(user, messagePayload);
         const isSuccess = !!response.success;

         results.push({
            userId: user._id,
            success: isSuccess,
            error: response.error || null,
         });

         if (isSuccess) successCount++;
         else failureCount++;
      } catch (err) {
         failureCount++;
         results.push({ userId: user._id, success: false, error: err.message });
      }
   }

   // Summary and DB logging
   const totalUsers = users.length;
   const successRate = totalUsers ? (successCount / totalUsers) * 100 : 0;
   const overallSuccess = successCount > 0;

   await campaignModel.create({
      name: `Campaign ${campaignType} - ${new Date().toISOString()}`,
      type: campaignType,
      channel,
      successCount,
      failureCount,
      totalCount: totalUsers,
      successRate,
      startedBy: 'admin',
      users: results,
   });

   return {
      success: true,
      message: `${channel} campaign processed successfully`,
      data: {
         totalUsers,
         successfulMessages: successCount,
         failedMessages: failureCount,
         successRate,
         overallSuccess,
         results,
      },
      statusCode: 200,
   };
};

// WhatsApp Campaign
exports.handleStartWhatsAppCampaign = req =>
   processCampaign({
      req,
      channel: 'whatsapp',
      campaignType: req.body.campaignType,
      contactField: 'phoneNumber',
      sendFn: async user => sendWhatsAppMessage(user.phoneNumber),
   });

// Email Campaign
exports.handleStartEmailCampaign = req =>
   processCampaign({
      req,
      channel: 'email',
      campaignType: req.body.campaignType,
      contactField: 'email',
      sendFn: async user => sendEmailReminder(user),
   });

// Android Push Notification Campaign
exports.handleStartAndriodPushNotificationCampaign = req =>
   processCampaign({
      req,
      channel: 'push_notification_android',
      campaignType: req.body.campaignType,
      contactField: 'fcmToken',
      sendFn: async user =>
         sendPushNotification(user.fcmToken, user.apnToken, user._id, {
            title: 'Special Offer Just for You! 🐾',
            body: 'Something is waiting in your cart at Petcaart. Complete your order now and enjoy exclusive discounts!',
         }),
   });

// iOS Push Notification Campaign
exports.handleStartiOSPushNotificationCampaign = req =>
   processCampaign({
      req,
      channel: 'push_notification_ios',
      campaignType: req.body.campaignType,
      contactField: 'apnToken',
      sendFn: async user =>
         sendViaAPNs({
            apnToken: user.apnToken,
            notificationData: {
               title: 'Special Offer Just for You! 🐾',
               body: 'Something is waiting in your cart at Petcaart. Complete your order now and enjoy exclusive discounts!',
            },
            userId: user._id,
            topicOverride: process.env.APN_TOPIC_OVERRIDE,
         }),
   });

exports.getAllCampaigns = async () => {
   const campaigns = await campaignModel.find().sort({ createdAt: -1 });
   if (!campaigns.length) {
      return {
         success: false,
         data: null,
         message: 'No campaigns found',
         statusCode: 404,
      };
   }
   return {
      success: true,
      data: campaigns,
      message: 'Campaigns fetched successfully',
      statusCode: 200,
   };
};
exports.getSingleCampaign = async id => {
   const campaign = await campaignModel
      .findById(id)
      .populate('users.userId', 'name email phoneNumber');
   if (!campaign) {
      return {
         success: false,
         data: null,
         message: 'Campaign not found',
         statusCode: 404,
      };
   }
   return {
      success: true,
      data: campaign,
      message: 'Campaign fetched successfully',
      statusCode: 200,
   };
};
