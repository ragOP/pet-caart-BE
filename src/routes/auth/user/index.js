const express = require('express');
const { handleUserRegister, handleUserLogin, handleAllUsers } = require('../../../controllers/auth/user/index');
const { isAdmin } = require('../../../middleware/auth/adminMiddleware');
const { validateMobileAndOTP } = require('../../../validators/auth/index');
const { validateRequest } = require('../../../middleware/validateRequest/index')
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

/**
 * @swagger
 * /api/auth/user/register:
 *   post:
 *     summary: Register a new user
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
 *         description: User registered successfully
 */
router.route('/register').post(validateMobileAndOTP, validateRequest, handleUserRegister);

/**
 * @swagger
 * /api/auth/user/login:
 *   post:
 *     summary: Login a user
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
router.route('/login').post(validateMobileAndOTP, validateRequest, handleUserLogin);

module.exports = router;
