const express = require('express');
const router = express.Router();

const {
  checkExpectedDelivery,
  handleTrackDelivery,
} = require('../../controllers/expected_delivery/index');
const { validateRequest } = require('../../middleware/validateRequest');

/**
 * @swagger
 * /api/delivery/check:
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
 *               pincode:
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

/**
 * @swagger
 * /api/delivery/track:
 *   post:
 *     summary: Track delivery
 *     description: Track delivery
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
 *               awbId:
 *                 type: string
 *                 description: The AWB ID of the delivery
 *     responses:
 *       200:
 *         description: Delivery tracked successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.route('/track').post(validateRequest, handleTrackDelivery);

module.exports = router;
