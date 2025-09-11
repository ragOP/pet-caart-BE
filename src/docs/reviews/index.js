/**
 * @swagger
 * /api/reviews/create:
 *   post:
 *     summary: Create a new review
 *     description: Create a new review for a product
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 description: The ID of the product to review
 *               review:
 *                 type: string
 *                 description: The review text
 *               rating:
 *                 type: number
 *                 description: The rating for the product
 *     responses:
 *       200:
 *         description: Review created successfully
 *       400:
 *         description: Review not created
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/reviews/get-all-reviews/{id}:
 *   get:
 *     summary: Get all reviews for a product
 *     description: Get all reviews for a product
 *     tags: [Reviews]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *       - name: sortBy
 *         in: query
 *         required: false
 *         description: Sort by createdAt or rating
 *         schema:
 *           type: string
 *           enum: [LTH, HTL, HTR, LTR]
 *     responses:
 *       200:
 *         description: Reviews fetched successfully
 *       400:
 *         description: Reviews not fetched
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/reviews/check-if-user-bought-product/{id}:
 *   get:
 *     summary: Check if user bought the product
 *     description: Check if user bought the product
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: User bought the product
 *       400:
 *         description: User not bought the product
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
