/**
 * @swagger
 * /api/subcategory:
 *   post:
 *     summary: Create a new subcategory
 *     tags: [SubCategory]
 *     security:
 *       - bearerAuth: []
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
 *             category:
 *               type: string
 *               example: 'Electronics'
 *             categoryId:
 *               type: string
 *               example: '27461274612466354621216gedvgfdccsd'
 *             image:
 *               type: File
 *
 *     responses:
 *       201:
 *         description: Subcategory created successfully
 */

/**
 * @swagger
 * /api/subcategory:
 *   get:
 *     summary: Get subcategories (all or filtered by categoryId)
 *     tags: [SubCategory]
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *         required: false
 *         description: ID of the category to filter subcategories
 *       - in: query
 *         name: categorySlug
 *         schema:
 *           type: string
 *         required: false
 *         description: Slug of the category to filter subcategories
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         required: false
 *         description: Search by name or slug
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         default: 1
 *       - in: query
 *         name: per_page
 *         schema:
 *           type: integer
 *         default: 50
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *       - in: query
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *     responses:
 *       200:
 *         description: List of subcategories
 */

/**
 * @swagger
 * /api/subcategory/{id}:
 *   get:
 *     summary: Get a subcategory by ID
 *     tags: [SubCategory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the subcategory
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Subcategory retrieved successfully
 */

/**
 * @swagger
 * /api/subcategory/{id}:
 *   put:
 *     summary: Update a subcategory by ID
 *     tags: [SubCategory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the subcategory
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the subcategory
 *               slug:
 *                 type: string
 *                 description: The slug of the subcategory
 *               description:
 *                 type: string
 *                 description: The description of the subcategory
 *               categoryId:
 *                 type: string
 *                 description: The category ID of the subcategory
 *               image:
 *                 type: file
 *                 format: binary
 *                 description: The image of the subcategory
 *               isActive:
 *                 type: boolean
 *                 description: The active status of the subcategory
 *     responses:
 *       200:
 *         description: Subcategory updated successfully
 */
