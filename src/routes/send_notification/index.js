const express = require('express');
const {
   sendNotificationtoAllUsers,
   sendNotificationToIosUser,
} = require('../../controllers/send_notification');
const { isAdmin } = require('../../middleware/auth/adminMiddleware');
const router = express.Router();

router.route('/send-notification').post(isAdmin, sendNotificationtoAllUsers);
router.route('/ios').post(isAdmin, sendNotificationToIosUser);
module.exports = router;
