const express = require('express');
const router = express.Router();
const { createPayment } = require('../../controllers/payment/index');
const { validateRequest } = require('../../middleware/validateRequest');
const { isUser } = require('../../middleware/auth/adminMiddleware');

router.route('/create-payment').post(isUser, validateRequest, createPayment);

module.exports = router;
