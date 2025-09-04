const express = require('express');
const {
  handleUserRegister,
  handleUserLogin,
  handleUpdateProfile,
} = require('../../../controllers/auth/user/index');
const { isAdmin, isUser } = require('../../../middleware/auth/adminMiddleware');
const { validateMobileAndOTP } = require('../../../validators/auth/index');
const { validateRequest } = require('../../../middleware/validateRequest/index');
const router = express.Router();

/**
 * @swagger
 * /api/auth/user/login:
 *   post:
 *     summary: Login/Signup a user
 *     tags: [Auth]
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
 *               otp:
 *                 type: string
 *                 example: '123456'
 *               fcmToken:
 *                 type: string
 *                 example: 'fcm_token_example'
 *               apnToken:
 *                 type: string
 *                 example: 'apn_token_example'
 *     responses:
 *       201:
 *         description: User login successfully
 */
router.route('/login').post(validateMobileAndOTP, validateRequest, handleUserLogin);

/**
 * @swagger
 * /api/auth/user/update-profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: 'John Doe'
 *               email:
 *                 type: string
 *                 example: 'john.doe@example.com'
 *               phoneNumber:
 *                 type: string
 *                 example: '1234567890'
 *     responses:
 *       200:
 *         description: User profile updated successfully
 */
router.route('/update-profile').put(isUser, validateRequest, handleUpdateProfile);

module.exports = router;
