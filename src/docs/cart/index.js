/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get the cart of the user
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: address_id
 *         in: query
 *         description: The ID of the address to get the cart for
 *         required: false
 *         schema:
 *           type: string
 *           example: 6666666666666666
 *       - name: coupon_id
 *         in: query
 *         description: The ID of the coupon to get the cart for
 *         required: false
 *         schema:
 *           type: string
 *           example: 6666666666666666
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 *       404:
 *         description: Cart not found
 */

/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Add a product to the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required:
 *         - product_id
 *         - quantity
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_id:
 *                 type: string
 *                 description: The ID of the product to add to the cart
 *               quantity:
 *                 type: number
 *                 description: The quantity of the product to add to the cart
 *               variant_id:
 *                 type: string
 *                 description: The ID of the variant to add to the cart
 *     responses:
 *       200:
 *         description: Product added to cart successfully
 *       400:
 *         description: Invalid quantity
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * /api/cart/{id}:
 *   delete:
 *     summary: Delete a product from the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the product to delete from the cart
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted from cart successfully
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * /api/cart/abandoned:
 *   get:
 *     summary: Get all abandoned carts (Admin only)
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Abandoned carts retrieved successfully
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /api/cart/previous-order:
 *   post:
 *     summary: Add items to cart from a previous order
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required:
 *         - orderId
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: string
 *                 description: The ID of the previous order
 *     responses:
 *       200:
 *         description: Items added to cart successfully
 *       404:
 *         description: Previous order not found
 */
