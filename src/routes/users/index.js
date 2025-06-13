const express = require('express');
const { handleUserRegister, handleUserLogin, handleAllUsers } = require('../../controllers/auth/user/index');
const { isAdmin } = require('../../middleware/auth/adminMiddleware');
const { validateMobileAndOTP } = require('../../validators/auth/index');
const { validateRequest } = require('../../middleware/validateRequest/index')
const router = express.Router();

/**
 * @swagger
 * /api/auth/user:
 *   post:
 *     summary: Get all users
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *     responses:
 *       201:
 *         description: Users retrieved successfully
 */
router.route('/').get(isAdmin, validateRequest, handleAllUsers);

module.exports = router;
