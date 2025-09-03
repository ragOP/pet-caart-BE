const userModel = require("../../models/userModel");
const ApiResponse = require("../../utils/apiResponse");
const { asyncHandler } = require("../../utils/asyncHandler");
const { sendPushNotification } = require("../../utils/send_notification");

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
