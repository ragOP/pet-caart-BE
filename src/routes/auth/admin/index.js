const express = require('express');
const { handleAdminLogin } = require('../../../controllers/auth/admin/index');
const { validateMobileAndOTP } = require('../../../validators/auth/index');
const { validateRequest } = require('../../../middleware/validateRequest/index');
const router = express.Router();

/**
 * @swagger
 * /api/auth/admin/login:
 *   post:
 *     summary: Login a admin
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
 *     responses:
 *       201:
 *         description: User login successfully
 */
router.route('/login').post(validateMobileAndOTP, validateRequest, handleAdminLogin);

module.exports = router;
