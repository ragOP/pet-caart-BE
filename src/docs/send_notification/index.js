/**
 * @swagger
 * /api/send-notification/android:
 *   post:
 *     summary: Send notification to all users
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notificationData:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                     example: "Hello"
 *                   body:
 *                     type: string
 *                     example: "This is a test notification"
 *               userIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "user_id_example"
 *     responses:
 *       200:
 *         description: Notification sent successfully
 */

/**
 * @swagger
 * /api/send-notification/ios:
 *   post:
 *     summary: Send notification to iOS users
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notificationData:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                     example: "Hello"
 *                   body:
 *                     type: string
 *                     example: "This is a test notification"
 *               userIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "user_id_example"
 *               topicOverride:
 *                 type: string
 *                 example: "com.example.app"
 *     responses:
 *       200:
 *         description: Notification sent successfully
 */

/**
 * @swagger
 * /api/campaign/start-campaign:
 *   post:
 *     summary: Send campaign to users
 *     tags: [Campaign]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               campaignType:
 *                 type: string
 *                 description: Type of campaign to send
 *                 enum:
 *                   - whatsapp
 *                   - email
 *                   - push_notification_android
 *                   - push_notification_ios
 *                 example: whatsapp
 *               userIds:
 *                 type: array
 *                 description: List of user IDs to send campaign to
 *                 items:
 *                   type: string
 *                   example: "66fbd13d98a6e65a1e7c12ab"
 *     responses:
 *       200:
 *         description: Notification sent successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Users not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/campaign/get-all-campaigns:
 *   get:
 *    summary: Get all campaigns
 *    tags: [Campaign]
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Campaigns fetched successfully
 *      404:
 *        description: No campaigns found
 *      500:
 *        description: Internal server error
 */

/**
 * @swagger
 * /api/campaign/get-single-campaign/{id}:
 *  get:
 *    summary: Get a single campaign
 *    tags: [Campaign]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: ID of the campaign to retrieve
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Campaign fetched successfully
 *      404:
 *        description: Campaign not found
 *      500:
 *        description: Internal server error
 */
