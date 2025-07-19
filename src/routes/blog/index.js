const express = require('express');
const multer = require('multer');
const { storage } = require('../../config/multer.js');
const { isAdmin } = require('../../middleware/auth/adminMiddleware.js');
const {
  handleCreateBlog,
  handleGetAllBlogs,
  handleGetSingleBlog,
  handleDeleteBlog,
  handleUpdateBlog,
  handleYouMayLike,
  handleGetLatestBlogs
} = require('../../controllers/blog/index.js');
const { validateRequest } = require('../../middleware/validateRequest/index.js');
const router = express.Router();
const upload = multer({ storage: storage });

/**
 * @swagger
 * /api/blog:
 *   post:
 *     summary: Create a blog
 *     tags: [Blog]
 *     description: Create a blog
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
 *               content:
 *                 type: string
 *               image:
 *                 type: file
 *                 required: true
 *               slug:
 *                 type: string
 *               category:
 *                 type: string
 *               isPublished:
 *                 type: boolean
 *               isFeatured:
 *                 type: boolean
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 default: []
 *     responses:
 *       200:
 *         description: Blog created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

router.route('/').post(upload.single('image'), isAdmin, validateRequest, handleCreateBlog);

/**
 * @swagger
 * /api/blog:
 *   get:
 *     summary: Get all blogs
 *     tags: [Blog]
 *     description: Get all blogs
 *     parameters:
 *       - name: page
 *         in: query
 *         type: number
 *         required: false
 *       - name: limit
 *         in: query
 *         type: number
 *         required: false
 *       - name: search
 *         in: query
 *         type: string
 *         required: false
 *       - name: category
 *         in: query
 *         type: string
 *         required: false
 *       - name: isPublished
 *         in: query
 *         type: boolean
 *         required: false
 *       - name: isFeatured
 *         in: query
 *         type: boolean
 *         required: false
 *       - name: isBanner
 *         in: query
 *         type: boolean
 *         required: false
 *     responses:
 *       200:
 *         description: Blogs fetched successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

router.route('/').get(validateRequest, handleGetAllBlogs);

/**
 * @swagger
 * /api/blog/{id}:
 *   get:
 *     summary: Get a blog
 *     tags: [Blog]
 *     description: Get a blog
 *     parameters:
 *       - name: id
 *         in: path
 *         type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Blog fetched successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 *       404:
 *         description: Blog not found
 */

router.route('/:id').get(validateRequest, handleGetSingleBlog);

/**
 * @swagger
 * /api/blog/{id}:
 *   delete:
 *     summary: Delete a blog
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     description: Delete a blog
 *     parameters:
 *       - name: id
 *         in: path
 *         type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Blog deleted successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 *       404:
 *         description: Blog not found
 */

router.route('/:id').delete(handleDeleteBlog);

/**
 * @swagger
 * /api/blog/{id}:
 *   put:
 *     summary: Update a blog
 *     tags: [Blog]
 *     description: Update a blog
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               image:
 *                 type: string
 *               slug:
 *                 type: string
 *               category:
 *                 type: string
 *               isPublished:
 *                 type: boolean
 *               isFeatured:
 *                 type: boolean
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 default: []
 *     responses:
 *       200:
 *         description: Blog updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 *       404:
 *         description: Blog not found
 */
router.route('/:id').put(handleUpdateBlog);

/**
 * @swagger
 * /api/blog/you-may-like:
 *   get:
 *     summary: Get you may like blogs
 *     tags: [Blog]
 *     description: Get you may like blogs
 *     parameters:
 *       - name: tags
 *         in: query
 *         type: array
 *         items:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Blogs fetched successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.route('/you-may-like').get(handleYouMayLike);

/**
 * @swagger
 * /api/blog/get-latest-blogs:
 *   get:
 *     summary: Get latest blogs
 *     tags: [Blog]
 *     description: Get latest blogs
 *     responses:
 *       200:
 *         description: Blogs fetched successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.route('/get-latest-blogs').get(handleGetLatestBlogs);

module.exports = router;
