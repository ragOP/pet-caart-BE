/**
 * @swagger
 * /api/brand:
 *   post:
 *     summary: Create a brand
 *     tags: [Brand]
 *     description: Create a brand
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the brand
 *               slug:
 *                 type: string
 *                 description: The slug of the brand
 *               description:
 *                 type: string
 *                 description: The description of the brand
 *               active:
 *                 type: boolean
 *                 description: The active status of the brand
 *               images:
 *                 type: array
 *                 description: The images of the brand
 *                 items:
 *                   type: file
 *                   format: binary
 *                   description: The image of the brand
 *                   required: true
 *                   maxItems: 10
 *                   minItems: 1
 *                   uniqueItems: true
 *                   example:
 *                     - image: image.jpg
 *                       alt: Brand image
 *     responses:
 *       201:
 *         description: Brand created successfully
 */

/**
 * @swagger
 * /api/brand:
 *   get:
 *     summary: Get all brands
 *     tags: [Brand]
 *     responses:
 *       200:
 *         description: Brands fetched successfully
 */

/**
 * @swagger
 * /api/brand/{id}:
 *   get:
 *     summary: Get a brand by id
 *     tags: [Brand]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The id of the brand
 *         type: string
 *     responses:
 *       200:
 *         description: Brand fetched successfully
 */

/**
 * @swagger
 * /api/brand/{id}:
 *   put:
 *     summary: Update a brand by id
 *     security:
 *       - bearerAuth: []
 *     tags: [Brand]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The id of the brand
 *         type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the brand
 *               slug:
 *                 type: string
 *                 description: The slug of the brand
 *               description:
 *                 type: string
 *                 description: The description of the brand
 *               active:
 *                 type: boolean
 *                 description: The active status of the brand
 *               images:
 *                 type: file
 *                 format: binary
 *                 description: The image of the brand
 *                 required: false
 *                 example:
 *                   image: image.jpg
 *                   alt: Brand image
 *     responses:
 *       200:
 *         description: Brand updated successfully
 */
