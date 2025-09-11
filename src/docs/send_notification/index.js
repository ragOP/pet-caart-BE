/**
 * @swagger
 * /api/send-notification:
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
 * /api/ios:
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
