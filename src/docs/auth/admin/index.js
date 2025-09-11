/**
 * @swagger
 * /api/auth/admin/login:
 *   post:
 *     summary: Login a admin
 *     tags: [Auth]
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
 *               otp:
 *                 type: string
 *                 example: '123456'
 *     responses:
 *       201:
 *         description: User login successfully
 */
