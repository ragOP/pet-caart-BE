/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     description: Creates a new order with the given items and address
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: isUsingWalletAmount
 *         in: query
 *         description: Whether the user is using wallet balance
 *         required: false
 *         schema:
 *           type: boolean
 *           example: true
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
 *               razorpayOrderId:
 *                 type: string
 *                 description: The ID of the Razorpay order
 *               razorpayPaymentId:
 *                 type: string
 *                 description: The ID of the Razorpay payment
 *               razorpaySignature:
 *                 type: string
 *                 description: The signature of the Razorpay order
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

/**
 * @swagger
 * /api/orders/{id}/create-shiprocket-order:
 *   post:
 *     summary: Create a shiprocket order
 *     description: Creates a shiprocket order by its ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the order to create a shiprocket order for
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               length:
 *                 type: number
 *                 description: The length of the package
 *               width:
 *                 type: number
 *                 description: The width of the package
 *               height:
 *                 type: number
 *                 description: The height of the package
 *     responses:
 *       200:
 *         description: Shiprocket order created successfully
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
