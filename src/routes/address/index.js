const express = require('express');
const { isUser } = require('../../middleware/auth/adminMiddleware');
const { handleCreateAddress, handleUpdateAddress, handleDeleteAddress, handleGetAllSavedAddresses } = require('../../controllers/address');
const { validateRequest } = require('../../middleware/validateRequest');
const router = express.Router();

/**
 * @swagger
 * /api/address:
 *   post:
 *     summary: Create a new address
 *     tags: [Address]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: 'John'
 *               lastName:
 *                 type: string
 *                 example: 'Doe'
 *               address:
 *                 type: string
 *                 example: '123 Main St'
 *               city:
 *                 type: string
 *                 example: 'New York'
 *               state:
 *                 type: string
 *                 example: 'NY'
 *               zip:
 *                 type: string
 *                 example: '10001'
 *               country:
 *                 type: string
 *                 example: 'USA'
 *               phone:
 *                 type: string
 *                 example: '1234567890'
 *               type:
 *                 type: string
 *                 enum: ['home', 'office', 'other']
 *                 example: 'home'
 *               isDefault:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Address created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.route('/').post(isUser, validateRequest, handleCreateAddress);

/**
 * @swagger
 * /api/address/{id}:
 *   put:
 *     summary: Update an address
 *     tags: [Address]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the address to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: 'John'
 *               lastName:
 *                 type: string
 *                 example: 'Doe'
 *               address:
 *                 type: string
 *                 example: '123 Main St'
 *               city:
 *                 type: string
 *                 example: 'New York'
 *               state:
 *                 type: string
 *                 example: 'NY'
 *               zip:
 *                 type: string
 *                 example: '10001'
 *               country:
 *                 type: string
 *                 example: 'USA'
 *               phone:
 *                 type: string
 *                 example: '1234567890'
 *               type:
 *                 type: string
 *                 enum: ['home', 'office', 'other']
 *                 example: 'home'
 *               isDefault:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Address updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.route('/:id').put(isUser, validateRequest, handleUpdateAddress);

/**
 * @swagger
 * /api/address/{id}:
 *   delete:
 *     summary: Delete an address
 *     tags: [Address]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the address to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Address deleted successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.route('/:id').delete(isUser, handleDeleteAddress);

/**
 * @swagger
 * /api/address:
 *   get:
 *     summary: Get all saved addresses
 *     tags: [Address]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All saved addresses retrieved successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.route('/').get(isUser, handleGetAllSavedAddresses);


module.exports = router;
