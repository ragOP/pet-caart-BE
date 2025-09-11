/**
 * @swagger
 * /api/category:
 *   post:
 *     summary: Create a new category
 *     tags: [Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *             name:
 *               type: string
 *               example: 'Electronics'
 *             slug:
 *               type: string
 *               example: 'electronics'
 *             description:
 *               type: string
 *               example: 'Electronics'
 *     responses:
 *       201:
 *         description: Category created successfully
 */

/**
 * @swagger
 * /api/category:
 *   get:
 *     summary: Get all categories
 *     tags: [Category]
 *     parameters:
 *       - name: search
 *         in: query
 *         required: false
 *         description: The search query
 *         type: string
 *       - name: page
 *         in: query
 *         required: false
 *         description: The page number
 *         type: number
 *       - name: limit
 *         in: query
 *         required: false
 *         description: The limit of the categories
 *         type: number
 *       - name: start_date
 *         in: query
 *         required: false
 *         description: The start date of the categories
 *         type: string
 *       - name: end_date
 *         in: query
 *         required: false
 *         description: The end date of the categories
 *         type: string
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 */

/**
 * @swagger
 * /api/category/{id}:
 *   get:
 *     summary: Get a category by id
 *     tags: [Category]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The id of the category
 *         type: string
 *     responses:
 *       200:
 *         description: Category fetched successfully
 */


/**
 * @swagger
 * /api/category/{id}:
 *   put:
 *     summary: Update a category by id
 *     security:
 *       - bearerAuth: []
 *     tags: [Category]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The id of the category
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
 *                 description: The name of the category
 *               slug:
 *                 type: string
 *                 description: The slug of the category
 *               description:
 *                 type: string
 *                 description: The description of the category
 *               isVisible:
 *                 type: boolean
 *                 description: The visibility of the category
 *               images:
 *                 type: file
 *                 format: binary
 *                 description: The image of the category
 *     responses:
 *       200:
 *         description: Category updated successfully
 */