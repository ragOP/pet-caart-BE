/**
 * @swagger
 * /api/configuration/banner:
 *   post:
 *     summary: Create a banner
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
 *               type:
 *                 type: string
 *                 enum: ['web', 'app', 'mobile', 'tablet']
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The image of the banner
 *     responses:
 *       201:
 *         description: Banner created successfully
 */

/**
 * @swagger
 * /api/configuration/banner/{id}:
 *   put:
 *     summary: Update a banner
 *     tags: [Configuration]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the banner to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: ['web', 'app', 'mobile', 'tablet']
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The image of the banner
 *     responses:
 *       200:
 *         description: Banner updated successfully
 */

/**
 * @swagger
 * /api/configuration/banner:
 *   get:
 *     summary: Get all banners
 *     tags: [Configuration]
 *     parameters:
 *       - name: type
 *         in: query
 *         required: true
 *         description: The type of the banner to get
 *     responses:
 *       200:
 *         description: Banners fetched successfully
 */

/**
 * @swagger
 * /api/configuration/ad-banner:
 *   post:
 *     summary: Create an ad banner
 *     tags: [Configuration]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the ad banner
 *               description:
 *                 type: string
 *                 description: The description of the ad banner
 *               link:
 *                 type: string
 *                 description: The link of the ad banner
 *               products:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: The products of the ad banner
 *     responses:
 *       200:
 *         description: Ad banner created successfully
 */

/**
 * @swagger
 * /api/configuration/ad-banner:
 *   get:
 *     summary: Get an ad banner
 *     tags: [Configuration]
 *     responses:
 *       200:
 *         description: Ad banner fetched successfully
 */
