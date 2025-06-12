const express = require("express");
const { handleCreateSubCategory, handleGetAllSubCategories, handleGetSubCategory } = require('../../controllers/sub_category/index.js');
const { validateCreateSubCategory } = require('../../validators/sub_category/index.js');
const { validateRequest } = require('../../middleware/validateRequest/index')
const multer = require("multer");
const { storage } = require("../../config/multer.js");
const { isAdmin } = require("../../middleware/auth/adminMiddleware.js");
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
  .route("/")
  .post(isAdmin, upload.array("images"), validateCreateSubCategory, validateRequest, handleCreateSubCategory);

/**
 * @swagger
 * /api/subcategory:
 *   get:
 *     summary: Get all subcategories
 *     tags: [SubCategory]
 *     responses:
 *       201:
 *         description: Subcategories retrieved successfully
 */
router.route("/").get(handleGetAllSubCategories);

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
router.route("/:id").get(handleGetSubCategory);

module.exports = router;