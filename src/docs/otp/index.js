/**
 * @swagger
 * /api/otp/send-otp:
 *   post:
 *     summary: Send OTP to user
 *     tags: [OTP]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 example: '1234567890'
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 */
