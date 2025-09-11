/**
 * @swagger
 * /api/product-banner/create:
 *   post:
 *     summary: Create product banner
 *     tags: [Configuration]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               productId:
 *                 type: string
 *                 description: The ID of the product to be featured in the banner
 *               isActive:
 *                 type: boolean
 *                 description: Whether the banner is active or not
 *               type:
 *                 type: string
 *                 description: The type of the banner
 *                 enum:
 *                   - web
 *                   - tablet
 *                   - mobile
 *                   - app
 *     responses:
 *       200:
 *         description: Product banner created successfully
 */

/**
 * @swagger
 * /api/product-banner/get:
 *   get:
 *     summary: Get product banner
 *     tags: [Configuration]
 *     parameters:
 *       - name: type
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           enum:
 *             - web
 *             - tablet
 *             - mobile
 *             - app
 *       - name: isAdmin
 *         in: query
 *         type: boolean
 *         description: The isAdmin status of the product banner
 *     responses:
 *       200:
 *         description: Product banner fetched successfully
 */

/**
 * @swagger
 * /api/product-banner/update:
 *   put:
 *     summary: Update product banner
 *     tags: [Configuration]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 description: The ID of the product to be featured in the banner
 *               isActive:
 *                 type: boolean
 *                 description: Whether the banner is active or not
 *               type:
 *                 type: string
 *                 description: The type of the banner
 *                 enum:
 *                   - web
 *                   - tablet
 *                   - mobile
 *                   - app
 *               image:
 *                 type: file
 *                 format: binary
 *                 required: false
 *                 description: The image of the banner
 *     responses:
 *       200:
 *         description: Product banner updated successfully
 */
