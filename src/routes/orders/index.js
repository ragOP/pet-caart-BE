const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrderById,
  getAllUserOrders,
  getAllOrders,
  getOrderByIdAdmin,
  updateOrderStatus,
} = require('../../controllers/orders');
const { validateRequest } = require('../../middleware/validateRequest');
const { isUser, isAdmin } = require('../../middleware/auth/adminMiddleware');

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

/**
 * @swagger
 * /api/orders/get-all-user-orders:
 *   get:
 *     summary: Get all user orders
 *     description: Retrieves all orders for the authenticated user
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: No orders found
 */
router.route('/get-all-user-orders').get(isUser, validateRequest, getAllUserOrders);

/**
 * @swagger
 * /api/orders/get-all-orders:
 *   get:
 *     summary: Get all orders
 *     description: Retrieves all orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.route('/get-all-orders').get(isAdmin, validateRequest, getAllOrders);

/**
 * @swagger
 * /api/orders/get-order-by-id/{id}:
 *   get:
 *     summary: Get an order by ID
 *     description: Retrieves an order by its ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the order to retrieve
 *     responses:
 *       200:
 *         description: Order retrieved successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Order not found
 */
router.route('/get-order-by-id/:id').get(isAdmin, validateRequest, getOrderByIdAdmin);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get an order by ID
 *     description: Retrieves an order by its ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the order to retrieve
 *     responses:
 *       200:
 *         description: Order retrieved successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Order not found
 */
router.route('/:id').get(isUser, validateRequest, getOrderById);

/**
 * @swagger
 * /api/orders/{id}/update-status:
 *   put:
 *     summary: Update the status of an order
 *     description: Updates the status of an order by its ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the order to update the status of
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: The new status of the order
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */
router.route('/:id/update-status').put(isAdmin, validateRequest, updateOrderStatus);

module.exports = router;
