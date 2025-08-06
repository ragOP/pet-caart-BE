const express = require('express');
const router = express.Router();

const { checkExpectedDelivery } = require('../../controllers/expected_delivery/index');
const { validateRequest } = require('../../middleware/validateRequest');

/**
 * @swagger
 * /delivery/check:
 *   post:
 *     summary: Check expected delivery
 *     description: Check expected delivery
 *     tags: [Expected Delivery]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pin_code:
 *                 type: string
 *                 description: The pin code of the expected delivery
 *     responses:
 *       200:
 *         description: Expected delivery fetched successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */

router.route('/check').post(validateRequest, checkExpectedDelivery);

module.exports = router;
