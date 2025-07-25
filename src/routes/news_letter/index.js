const express = require('express');
const router = express.Router();

const {
  handleSubscribe,
  handleUnsubscribe,
  handleGetAllSubscribers,
} = require('../../controllers/news_letter/index');

const { isAdmin } = require('../../middleware/auth/adminMiddleware');
const { validateRequest } = require('../../middleware/validateRequest');

/**
 * @swagger
 * /api/news-letter/subscribe:
 *   post:
 *     summary: Subscribe to the newsletter
 *     description: Subscribes a user to the newsletter
 *     tags: [Newsletter]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address of the user
 *               name:
 *                 type: string
 *                 description: The name of the user
 *     responses:
 *       200:
 *         description: Subscribed successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.route('/subscribe').post(validateRequest, handleSubscribe);

/**
 * @swagger
 * /api/news-letter/unsubscribe:
 *   post:
 *     summary: Unsubscribe from the newsletter
 *     description: Unsubscribes a user from the newsletter
 *     tags: [Newsletter]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address of the user
 *     responses:
 *       200:
 *         description: Unsubscribed successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.route('/unsubscribe').post(validateRequest, handleUnsubscribe);

/**
 * @swagger
 * /api/news-letter/get-all-subscribers:
 *   get:
 *     summary: Get all subscribers
 *     security:
 *       - bearerAuth: []
 *     description: Gets all subscribers from the newsletter
 *     tags: [Newsletter]
 *     responses:
 *       200:
 *         description: Subscribers fetched successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.route('/get-all-subscribers').get(isAdmin, handleGetAllSubscribers);

module.exports = router;
