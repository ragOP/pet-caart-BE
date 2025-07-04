const express = require('express');
const router = express.Router();
const { createOrder } = require('../../controllers/orders');
const { validateRequest } = require('../../middleware/validateRequest');
const { isUser } = require('../../middleware/auth/adminMiddleware');

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     description: Creates a new order with the given items and address
 *     tags: [Orders]
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
 *                 description: The ID of the cart to create an order from
 *               addressId:
 *                 type: string
 *                 description: The ID of the address to use for the order
 *               couponId:
 *                 type: string
 *                 description: The ID of the coupon to use for the order
 *               paymentMethod:
 *                 type: string
 *                 description: The payment method to use for the order
 *               note:
 *                 type: string
 *                 description: The note to add to the order
 *     responses:
 *       200:
 *         description: Order created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.route('/').post(isUser, validateRequest, createOrder);

module.exports = router;
