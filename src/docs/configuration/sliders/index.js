/**
 * @swagger
 * /api/sliders/slider:
 *   post:
 *     summary: Create a slider
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
 *               images:
 *                 type: string
 *                 format: binary
 *               link:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *               type:
 *                 type: string
 *                 enum:
 *                   - web
 *                   - app
 *                   - mobile
 *                   - tablet
 *     responses:
 *       201:
 *         description: Slider created successfully
 */


/**
 * @swagger
 * /api/sliders/slider:
 *   get:
 *     summary: Get all sliders
 *     tags: [Configuration]
 *     parameters:
 *       - name: type
 *         in: query
 *         required: true
 *         description: The type of the slider
 *         enum:
 *           - web
 *           - app
 *           - mobile
 *           - tablet
 *     responses:
 *       200:
 *         description: Sliders fetched successfully
 */


/**
 * @swagger
 * /api/sliders/slider/{id}:
 *   put:
 *     summary: Update a slider
 *     tags: [Configuration]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the slider to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: string
 *                 format: binary
 *               link:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *               type:
 *                 type: string
 *                 enum:
 *                   - web
 *                   - app
 *                   - mobile
 *     responses:
 *       200:
 *         description: Slider updated successfully
 */


/**
 * @swagger
 * /api/sliders/slider/{id}:
 *   get:
 *     summary: Get a slider by ID
 *     tags: [Configuration]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the slider to get
 *     responses:
 *       200:
 *         description: Slider fetched successfully
 */

/**
 * @swagger
 * /api/sliders/slider/{id}:
 *   delete:
 *     summary: Delete a slider
 *     tags: [Configuration]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the slider to delete
 *     responses:
 *       200:
 *         description: Slider deleted successfully
 */


/**
 * @swagger
 * /api/sliders/admin/slider:
 *   get:
 *     summary: Get all sliders
 *     tags: [Configuration]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: type
 *         in: query
 *         required: true
 *         description: The type of the slider
 *         enum:
 *           - web
 *           - app
 *           - mobile
 *           - tablet
 *     responses:
 *       200:
 *         description: Sliders fetched successfully
 */
