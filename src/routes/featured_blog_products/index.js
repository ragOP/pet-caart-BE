const express = require('express');
const multer = require('multer');
const router = express.Router();

const {
  handleCreateBlogFeaturedProduct,
  handleGetFeaturedProducts,
  handleDeleteFeaturedProduct,
  handleUpdateFeaturedProduct,
} = require('../../controllers/featured_blog_products/index.js');
const { storage } = require('../../config/multer.js');
const { isAdmin } = require('../../middleware/auth/adminMiddleware');
const { validateRequest } = require('../../middleware/validateRequest');
const upload = multer({ storage: storage });

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
 *               productId:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
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
router
  .route('/create')
  .post(isAdmin, validateRequest, upload.single('bannerImage'), handleCreateBlogFeaturedProduct);

/**
 * @swagger
 * /api/featured-blog-products/get-featured-products/{id}:
 *   get:
 *     summary: Get featured products
 *     security:
 *       - bearerAuth: []
 *     description: Gets all featured products
 *     tags: [Featured Blog Products]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the featured product
 *         required: true
 *         schema:
 *           type: string
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
router.route('/get-featured-products/:id').get(isAdmin, handleGetFeaturedProducts);

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
router
  .route('/delete-featured-product/:id')
  .delete(isAdmin, validateRequest, handleDeleteFeaturedProduct);

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
router
  .route('/update-featured-product/:id')
  .put(isAdmin, validateRequest, upload.single('bannerImage'), handleUpdateFeaturedProduct);

module.exports = router;
