/**
 * @swagger
 * /api/settings/header-footer/get:
 *   get:
 *     summary: Get header and footer
 *     tags: [Settings]
 *     responses:
 *       200:
 *         description: Header and footer fetched successfully
 */

/**
 * @swagger
 * /api/settings/header-footer/create:
 *   post:
 *     summary: Create header and footer
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               logo:
 *                 type: file
 *                 format: binary
 *                 required: false
 *                 description: The logo of the header and footer
 *               address:
 *                 type: string
 *                 description: The address of the header and footer
 *               phone:
 *                 type: string
 *                 description: The phone of the header and footer
 *               email:
 *                 type: string
 *                 description: The email of the header and footer
 *               facebook:
 *                 type: string
 *                 description: The facebook of the header and footer
 *               instagram:
 *                 type: string
 *                 description: The instagram of the header and footer
 *               twitter:
 *                 type: string
 *                 description: The twitter of the header and footer
 *               linkedin:
 *                 type: string
 *                 description: The linkedin of the header and footer
 *               youtube:
 *                 type: string
 *                 description: The youtube of the header and footer
 *     responses:
 *       200:
 *         description: Header and footer created successfully
 */
