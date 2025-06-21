const express = require("express");
const { handleCreateCategory, handleGetAllCategories, handleGetSingleCategory } = require('../../controllers/category/index.js');
const { validateCreateCategory } = require('../../validators/category/index.js');
const { validateRequest } = require('../../middleware/validateRequest/index')
const multer = require("multer");
const { storage } = require("../../config/multer.js");
const { isAdmin } = require("../../middleware/auth/adminMiddleware.js");
const router = express.Router();

const upload = multer({ storage: storage });

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
router.route("/").post(isAdmin, upload.array("images"), validateCreateCategory, validateRequest, handleCreateCategory);

/**
 * @swagger
 * /api/category:
 *   post:
 *     summary: Get all categories
 *     tags: [Category]
 *     responses:
 *       201:
 *         description: Categories retrieved successfully
 */
router.route("/").get(handleGetAllCategories);

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
router.route("/:id").get(handleGetSingleCategory);

module.exports = router;