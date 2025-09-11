const userModel = require('../../models/userModel');
const ApiResponse = require('../../utils/apiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const { sendViaAPNs } = require('../../utils/send_ios_notification');
const { sendPushNotification } = require('../../utils/send_notification');

exports.sendNotificationtoAllUsers = asyncHandler(async (req, res) => {
   const { notificationData, userIds } = req.body;
   const users = await userModel.find({ _id: { $in: userIds } });

   const results = [];
   let successCount = 0;
   let failureCount = 0;

   for (const user of users) {
      if (!user.fcmToken) {
         failureCount++;
         continue;
      }
      const response = await sendPushNotification(
         user.fcmToken,
         user.apnToken,
         user._id,
         notificationData
      );

      results.push({
         userId: user._id,
         success: response.success,
         message: response.message,
         error: response.error || null,
      });

      if (response.success) {
         successCount++;
      } else {
         failureCount++;
      }
   }
   const overallSuccess = successCount > 0;
   const summary = {
      totalUsers: users.length,
      successCount,
      failureCount,
      results,
   };

   return res
      .status(200)
      .json(
         new ApiResponse(
            200,
            summary,
            `Notifications sent: ${successCount} successful, ${failureCount} failed`,
            overallSuccess
         )
      );
});

exports.sendNotificationToIosUser = asyncHandler(async (req, res) => {
   const { notificationData = {}, userIds = [], topicOverride } = req.body;
   let targets = [];
   if (!userIds || userIds.length === 0) {
      return res.status(400).json(new ApiResponse(400, null, 'No user IDs provided', false));
   }
   const users = await userModel.find({ _id: { $in: userIds } }, { apnToken: 1 });
   const userWithApnTokens = users
      .map(u => ({ userId: u._id, token: u.apnToken }))
      .filter(t => !!t.token);
   targets = targets.concat(userWithApnTokens);

   if (!targets.length) {
      return res
         .status(400)
         .json(
            new ApiResponse(400, null, 'No valid APN tokens found for the provided user IDs', false)
         );
   }

   const results = [];
   let successCount = 0,
      failureCount = 0;

   for (const t of targets) {
      const resp = await sendViaAPNs({
         apnToken: t.token,
         notificationData,
         userId: t.userId,
         topicOverride,
      });
      results.push({ userId: t.userId, ...resp });
      resp.success ? successCount++ : failureCount++;
   }

   return res.status(200).json(
      new ApiResponse(200, {
         totalUsers: targets.length,
         successCount,
         failureCount,
         results,
      })
   );
});
