/**
 * @swagger
 * /api/page-config/add-page-config:
 *   post:
 *     summary: Create a new PageConfig
 *     description: Admin-only endpoint to create a page configuration with sections.
 *     tags:
 *       - PageConfig
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pageKey
 *             properties:
 *               pageKey:
 *                 type: string
 *                 description: Page identifier (e.g., home, category, landing)
 *                 example: home
 *               sections:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - position
 *                     - key
 *                   properties:
 *                     position:
 *                       type: integer
 *                       description: Order of the section on the page
 *                       example: 1
 *                     key:
 *                       type: string
 *                       description: Section key (validated against PAGE_ALLOWED_KEYS for the given pageKey)
 *                       example: main_banner
 *                     type:
 *                       type: string
 *                       enum: [static, grid]
 *                       default: static
 *                       example: static
 *                     id:
 *                       type: string
 *                       format: objectId
 *                       description: Required only if type is 'grid'
 *                       example: 64f1a23bc34e7f001c1f9d88
 *           example:
 *             pageKey: "home"
 *             sections:
 *               - position: 1
 *                 key: "main_banner"
 *                 type: "static"
 *               - position: 2
 *                 key: "grid"
 *                 type: "grid"
 *                 id: "64f1a23bc34e7f001c1f9d88"
 *     responses:
 *       201:
 *         description: PageConfig created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 64f1a23bc34e7f001c1f9d99
 *                 pageKey:
 *                   type: string
 *                   example: home
 *                 sections:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       position:
 *                         type: integer
 *                         example: 1
 *                       key:
 *                         type: string
 *                         example: main_banner
 *                       type:
 *                         type: string
 *                         example: static
 *                       id:
 *                         type: string
 *                         example: null
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: 2025-09-11T14:21:00.000Z
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: 2025-09-11T14:21:00.000Z
 *       400:
 *         description: Validation error (invalid input or disallowed section key)
 *       401:
 *         description: Unauthorized (missing/invalid token or not an admin)
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/page-config/update-page-config/{id}:
 *   put:
 *     summary: Update an existing PageConfig
 *     description: Admin-only endpoint to update a page configuration by its ID.
 *     tags:
 *       - PageConfig
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The ID of the PageConfig to update
 *         example: 64f1a23bc34e7f001c1f9d88
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pageKey:
 *                 type: string
 *                 example: home
 *               sections:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     position:
 *                       type: integer
 *                       example: 1
 *                     key:
 *                       type: string
 *                       example: main_banner
 *                     type:
 *                       type: string
 *                       enum: [static, grid]
 *                       example: static
 *                     id:
 *                       type: string
 *                       format: objectId
 *                       example: 64f1a23bc34e7f001c1f9d99
 *           example:
 *             pageKey: "home"
 *             sections:
 *               - position: 1
 *                 key: "main_banner"
 *                 type: "static"
 *               - position: 2
 *                 key: "grid"
 *                 type: "grid"
 *                 id: "64f1a23bc34e7f001c1f9d99"
 *     responses:
 *       200:
 *         description: PageConfig updated successfully
 *       400:
 *         description: Validation error (invalid input or disallowed section key)
 *       401:
 *         description: Unauthorized (missing/invalid token or not an admin)
 *       404:
 *         description: PageConfig not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/page-config/get-all-page-configs:
 *   get:
 *     summary: Retrieve all PageConfigs
 *     description: Admin-only endpoint to fetch all page configurations.
 *     tags:
 *       - PageConfig
 *     responses:
 *       200:
 *         description: List of PageConfigs retrieved successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized (missing/invalid token or not an admin)
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/page-config/get-page-config-by-key/{pageKey}:
 *   get:
 *     summary: Retrieve a PageConfig by pageKey
 *     description: Admin-only endpoint to fetch a page configuration by its pageKey.
 *     tags:
 *       - PageConfig
 *     parameters:
 *       - in: path
 *         name: pageKey
 *         required: true
 *         schema:
 *           type: string
 *         description: The pageKey of the PageConfig to retrieve (e.g., home, category, landing)
 *         example: home
 *     responses:
 *       200:
 *         description: PageConfig retrieved successfully
 *       400:
 *         description: Bad request (missing/invalid pageKey)
 *       401:
 *         description: Unauthorized (missing/invalid token or not an admin)
 *       404:
 *         description: PageConfig not found
 *       500:
 *         description: Internal server error
 */
