const express = require('express');
const {
  handleCreateSubCategory,
  handleGetAllSubCategories,
  handleGetSingleSubCategory,
} = require('../../controllers/sub_category/index.js');
const { validateCreateSubCategory } = require('../../validators/sub_category/index.js');
const { validateRequest } = require('../../middleware/validateRequest/index');
const multer = require('multer');
const { storage } = require('../../config/multer.js');
const { isAdmin } = require('../../middleware/auth/adminMiddleware.js');
const router = express.Router();

const upload = multer({ storage: storage });

/**
 * @swagger
 * /api/subcategory:
 *   post:
 *     summary: Create a new subcategory
 *     tags: [SubCategory]
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
router
  .route('/')
  .post(
    isAdmin,
    upload.array('images'),
    validateCreateSubCategory,
    validateRequest,
    handleCreateSubCategory
  );

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
router.route('/').get(handleGetAllSubCategories);

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
router.route('/:id').get(handleGetSingleSubCategory);

module.exports = router;
