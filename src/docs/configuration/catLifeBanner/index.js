/**
 * @swagger
 * /api/cat-life-banner/create:
 *   post:
 *     summary: Create a new cat life banner
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
 *               title:
 *                 type: string
 *                 description: The title of the cat life banner
 *               link:
 *                 type: string
 *                 description: The link of the cat life banner
 *               image:
 *                 type:  file
 *                 format: binary
 *                 description: The image of the cat life banner
 *     responses:
 *       200:
 *         description: Cat life banner created successfully
 */

/**
 * @swagger
 * /api/cat-life-banner/get:
 *   get:
 *     summary: Get all cat life banners
 *     tags: [Configuration]
 *     responses:
 *       200:
 *         description: Cat life banners fetched successfully
 */

/**
 * @swagger
 * /api/cat-life-banner/update/{id}:
 *   put:
 *     summary: Update a cat life banner
 *     tags: [Configuration]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the cat life banner to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the cat life banner
 *               link:
 *                 type: string
 *                 description: The link of the cat life banner
 *               image:
 *                 type: file
 *                 format: binary
 *                 description: The image of the cat life banner
 *     responses:
 *       200:
 *         description: Cat life banner updated successfully
 */

/**
 * @swagger
 * /api/cat-life-banner/get-by-id/{id}:
 *   get:
 *     summary: Get a cat life banner by id
 *     tags: [Configuration]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the cat life banner to retrieve
 *     responses:
 *       200:
 *         description: Cat life banner fetched successfully
 */
