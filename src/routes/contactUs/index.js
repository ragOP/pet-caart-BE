const express = require('express');
const { isAdmin } = require('../../middleware/auth/adminMiddleware');
const { validateRequest } = require('../../middleware/validateRequest');
const { handleContactUs, handleGetAllContactUs, handleUpdateContactUs } = require('../../controllers/contactUs');
const router = express.Router();

/**
 * @swagger
 * /api/contact-us:
 *   post:
 *     summary: Create a new contact us message
 *     tags: [Contact Us]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contact us message created successfully
 */
router.route('/').post(validateRequest, handleContactUs);

/**
 * @swagger
 * /api/contact-us:
 *   get:
 *     summary: Get all contact us messages
 *     tags: [Contact Us]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Contact us messages retrieved successfully
 */
router.route('/').get(isAdmin, validateRequest, handleGetAllContactUs);

/**
 * @swagger
 * /api/contact-us/{id}:
 *   put:
 *     summary: Update a contact us message
 *     tags: [Contact Us]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the contact us message
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               responseMessage:
 *                 type: string
 *                 description: The response message from the admin
 *               responded:
 *                 type: boolean
 *                 description: Whether the message has been responded to
 *     responses:
 *       200:
 *         description: Contact us message updated successfully
 */
router.route('/:id').put(isAdmin, validateRequest, handleUpdateContactUs);

module.exports = router;
