const express = require('express');
const router = express.Router();
const { createPayment } = require('../../controllers/payment/index');
const { validateRequest } = require('../../middleware/validateRequest');
const { isUser } = require('../../middleware/auth/adminMiddleware');

/**
 * @swagger
 * /api/razorpay/create-payment:
 *   post:
 *     summary: Create a payment
 *     description: Create a payment for a user
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cartId:
 *                 type: string
 *                 description: The ID of the cart
 *               addressId:
 *                 type: string
 *                 description: The ID of the address
 *               couponId:
 *                 type: string
 *                 description: The ID of the coupon
 *     responses:
 *       200:
 *         description: Payment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orderId:
 *                   type: string
 *                   description: The ID of the order
 *                 amount:
 *                   type: number
 *                   description: The amount of the payment
 *                 currency:
 *                   type: string
 *                   description: The currency of the payment
 *                 receipt:
 *                   type: string
 *                   description: The receipt of the payment
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   description: The status code of the response
 *                 data:
 *                   type: object
 *                   description: The data of the response
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   description: The status code of the response
 *                 data:
 *                   type: object
 *                   description: The data of the response
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   description: The status code of the response
 *                 data:
 *                   type: object
 *                   description: The data of the response
 *       409:
 *         description: Conflict
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   description: The status code of the response
 *                 data:
 *                   type: object
 *                   description: The data of the response
 */
router.route('/create-payment').post(isUser, validateRequest, createPayment);   

module.exports = router;
