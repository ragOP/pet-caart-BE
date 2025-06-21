const express = require("express");
const { handleCreateProduct, handleGetAllProducts, handleGetSingleProduct } = require('../../controllers/product/index.js');
const { validateCreateProduct } = require('../../validators/product/index.js');
const { validateRequest } = require('../../middleware/validateRequest/index')
const multer = require("multer");
const { storage } = require("../../config/multer.js");
const { isAdmin } = require("../../middleware/auth/adminMiddleware.js");
const router = express.Router();
const upload = multer({ storage: storage });

router.route("/").post(
  isAdmin,
  upload.fields([
    { name: "images", maxCount: 20 },
    { name: "variantImages", maxCount: 100 },
  ]),
  validateRequest,
  handleCreateProduct
);

/**
 * @swagger
 * /api/product:
 *   get:
 *     summary: Get all products
 *     tags: [Product]
 *     parameters:
 *       - name: search
 *         in: query
 *         description: Search by name or slug
 *         required: false
 *         schema:
 *           type: string 
 *       - name: page
 *         in: query
 *         description: Page number
 *         required: false
 *         schema:
 *           type: number
 *       - name: per_page
 *         in: query
 *         description: Number of products per page
 *         required: false
 *         schema:
 *           type: number
 *       - name: start_date
 *         in: query
 *         description: Start date
 *         required: false
 *         schema:
 *           type: string
 *       - name: end_date
 *         in: query
 *         description: End date
 *         required: false
 *         schema:
 *           type: string
 *       - name: max_price
 *         in: query
 *         description: Maximum price
 *         required: false
 *         schema:
 *           type: number
 *       - name: isEverydayEssential
 *         in: query
 *         description: Is everyday essential
 *         required: false
 *         schema:
 *           type: boolean
 *       - name: isBestSeller
 *         in: query
 *         description: Is best seller
 *         required: false
 *         schema:
 *           type: boolean
 *       - name: newleyLaunched
 *         in: query
 *         description: Is newley launched
 *         required: false
 *         schema:
 *           type: boolean
 *       - name: isAddToCart
 *         in: query
 *         description: Is add to cart
 *         required: false
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Products fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 */

router.route("/").get(handleGetAllProducts);

/**
 * @swagger
 * /api/product/{id}:
 *   get:
 *     summary: Get a product by id
 *     tags: [Product]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The id of the product
 *         type: string
 *     responses:
 *       200: 
 *         description: Product fetched successfully
 */

router.route("/:id").get(handleGetSingleProduct);

module.exports = router;