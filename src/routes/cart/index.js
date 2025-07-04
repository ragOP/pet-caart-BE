const express = require('express');
const { getCart, addToCart, deleteCart } = require('../../controllers/cart/index.js');
const { validateRequest } = require('../../middleware/validateRequest/index.js');
const { isUser } = require('../../middleware/auth/adminMiddleware.js');
const router = express.Router();

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
router.get('/', isUser, validateRequest, getCart);

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
router.post('/', isUser, validateRequest, addToCart);

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
router.delete('/:id', isUser, validateRequest, deleteCart);

module.exports = router;
