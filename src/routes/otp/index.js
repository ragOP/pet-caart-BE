const express = require('express');
const router = express.Router();
const { sendOtp } = require('../../controllers/otp/index');
const { validateRequest } = require('../../middleware/validateRequest');

router.route('/send-otp').post(validateRequest, sendOtp);

module.exports = router;
