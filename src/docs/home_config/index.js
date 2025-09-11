/**
 * @swagger
 * /api/home-config/create:
 *   post:
 *     summary: Create a new home section configuration
 *     description: This route allows admin users to create a new home section configuration.
 *     tags:
 *       - HomeConfig
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
 *               contentType:
 *                 type: string
 *                 enum: [product, category, subCategory, collection]
 *               contentItems:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     itemId:
 *                       type: string
 *                     link:
 *                       type: string
 *                     imageUrl:
 *                       type: string
 *               grid:
 *                 type: object
 *                 properties:
 *                   columns:
 *                     type: integer
 *                   rows:
 *                     type: integer
 *                   mobileColumns:
 *                     type: integer
 *                   mobileRows:
 *                     type: integer
 *               isActive:
 *                 type: boolean
 *               backgroundImage:
 *                 type: string
 *                 description: URL of the background image
 *               bannerImage:
 *                 type: string
 *                 description: URL of the banner image
 *               keyword:
 *                 type: string
 *                 description: Keyword for the home section
 *     responses:
 *       '200':
 *         description: Home section created successfully
 *       '500':
 *         description: Failed to create home section
 */

/**
 * @swagger
 * /api/home-config/get-all-grid:
 *   get:
 *     summary: Get all grid configurations
 *     description: This route allows admin users to retrieve all grid configurations.
 *     tags:
 *       - HomeConfig
 *     parameters:
 *       - in: query
 *         name: keyword
 *         required: false
 *         schema:
 *           type: string
 *         description: Keyword to filter grid configurations
 *       - in: query
 *         name: isActive
 *         required: false
 *         schema:
 *           type: boolean
 *     responses:
 *       '200':
 *         description: Grid configurations retrieved successfully
 *       '500':
 *         description: Failed to retrieve grid configurations
 */

/**
 * @swagger
 * /api/home-config/get-one-grid/{id}:
 *   get:
 *     summary: Get a single grid configuration
 *     description: This route allows admin users to retrieve a single grid configuration by ID.
 *     tags: [HomeConfig]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the grid configuration to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Grid configuration retrieved successfully
 *       500:
 *         description: Failed to retrieve grid configuration
 */

/**
 * @swagger
 * /api/home-config/delete-grid/{id}:
 *   delete:
 *     summary: Delete a grid configuration
 *     description: This route allows admin users to delete a grid configuration by ID.
 *     tags: [HomeConfig]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the grid configuration to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Grid configuration deleted successfully
 *       500:
 *         description: Failed to delete grid configuration
 */

/**
 * @swagger
 * /api/home-config/update-grid/{id}:
 *   put:
 *     summary: Update a grid configuration
 *     description: This route allows admin users to update a grid configuration by ID.
 *     tags:
 *       - HomeConfig
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the grid configuration to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               contentType:
 *                 type: string
 *                 enum: [product, category, subCategory, collection]
 *               contentItems:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     itemId:
 *                       type: string
 *                     link:
 *                       type: string
 *                     imageUrl:
 *                       type: string
 *               grid:
 *                 type: object
 *                 properties:
 *                   columns:
 *                     type: integer
 *                   rows:
 *                     type: integer
 *                   mobileColumns:
 *                     type: integer
 *                   mobileRows:
 *                     type: integer
 *               isActive:
 *                 type: boolean
 *               backgroundImage:
 *                 type: string
 *                 description: URL of the background image
 *               bannerImage:
 *                 type: string
 *                 description: URL of the banner image
 *               keyword:
 *                 type: string
 *                 description: Keyword for the home section
 *     responses:
 *       '200':
 *         description: Grid configuration updated successfully
 *       '500':
 *         description: Failed to update grid configuration
 */

/**
 * @swagger
 * /api/home-config/update-grid-position/{id}:
 *   put:
 *     summary: Update the position of a grid configuration
 *     description: This route allows admin users to update the position of a grid configuration by ID.
 *     tags:
 *       - HomeConfig
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the grid configuration to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPosition:
 *                 type: integer
 *                 description: The new position for the grid configuration
 *               oldPosition:
 *                 type: integer
 *                 description: The old position of the grid configuration
 *     responses:
 *       '200':
 *         description: Grid configuration position updated successfully
 *       '500':
 *         description: Failed to update grid configuration position
 */

/**
 * @swagger
 * /api/home-config/update-status/{id}:
 *   put:
 *     summary: Update the active status of a grid configuration
 *     description: This route allows admin users to update the active status of a grid configuration by ID.
 *     tags:
 *       - HomeConfig
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the grid configuration to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isActive:
 *                 type: boolean
 *                 description: The new active status for the grid configuration
 *     responses:
 *       '200':
 *         description: Grid configuration status updated successfully
 *
 *       '500':
 *         description: Failed to update grid configuration status
 */