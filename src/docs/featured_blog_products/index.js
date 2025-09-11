/**
 * @swagger
 * /api/featured-blog-products/create:
 *   post:
 *     summary: Create a new featured product
 *     security:
 *       - bearerAuth: []
 *     description: Creates a new featured product
 *     tags: [Featured Blog Products]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               productIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: The product IDs for the featured product
 *               bannerImage:
 *                 type: file
 *                 format: binary
 *                 description: The banner image for the featured product
 *     responses:
 *       200:
 *         description: Featured product created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /api/featured-blog-products/get-featured-products:
 *   get:
 *     summary: Get featured products
 *     description: Gets all featured products
 *     tags: [Featured Blog Products]
 *     responses:
 *       200:
 *         description: Featured products fetched successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /api/featured-blog-products/delete-featured-product/{id}:
 *   delete:
 *     summary: Delete a featured product
 *     security:
 *       - bearerAuth: []
 *     description: Deletes a featured product
 *     tags: [Featured Blog Products]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the featured product
 *         required: true
 *     responses:
 *       200:
 *         description: Featured product deleted successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /api/featured-blog-products/update-featured-product/{id}:
 *   put:
 *     summary: Update a featured product
 *     security:
 *       - bearerAuth: []
 *     description: Updates a featured product
 *     tags: [Featured Blog Products]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the featured product
 *         required: true
 *     responses:
 *       200:
 *         description: Featured product updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
