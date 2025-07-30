const express = require('express');
const router = express.Router();
const { sendOtp } = require('../../controllers/otp/index');
const { validateRequest } = require('../../middleware/validateRequest');

/**
 * @swagger
 * /api/otp/send-otp:
 *   post:
 *     summary: Send OTP to user
 *     tags: [OTP]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 example: '1234567890'
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 */

router.route('/send-otp').post(validateRequest, sendOtp);

module.exports = router;
