const express = require("express");
const { handleCreateBrand, handleGetAllBrands, handleGetSingleBrand, handleUpdateBrand } = require('../../controllers/brand/index.js');
const { validateCreateBrand } = require('../../validators/brand/index.js');
const { validateRequest } = require('../../middleware/validateRequest/index')
const multer = require("multer");
const { storage } = require("../../config/multer.js");
const { isAdmin } = require("../../middleware/auth/adminMiddleware.js");
const router = express.Router();
const upload = multer({ storage: storage });

/**
 * @swagger
 * /api/brand:
 *   post:
 *     summary: Create a brand
 *     tags: [Brand]
 *     description: Create a brand
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the brand
 *               slug:
 *                 type: string
 *                 description: The slug of the brand
 *               description:
 *                 type: string
 *                 description: The description of the brand
 *               active:
 *                 type: boolean
 *                 description: The active status of the brand
 *               images:
 *                 type: array
 *                 description: The images of the brand
 *                 items:
 *                   type: file
 *                   format: binary
 *                   description: The image of the brand
 *                   required: true
 *                   maxItems: 10
 *                   minItems: 1
 *                   uniqueItems: true
 *                   example:
 *                     - image: image.jpg
 *                       alt: Brand image
 *     responses:
 *       201:
 *         description: Brand created successfully
 */

router.route("/").post(isAdmin, upload.array("images"), validateCreateBrand, validateRequest, handleCreateBrand);

/**
 * @swagger
 * /api/brand:
 *   get:
 *     summary: Get all brands
 *     tags: [Brand]
 *     responses:
 *       200:
 *         description: Brands fetched successfully
 */

router.route("/").get(handleGetAllBrands);

/**
 * @swagger
 * /api/brand/{id}:
 *   get:
 *     summary: Get a brand by id
 *     tags: [Brand]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The id of the brand
 *         type: string
 *     responses:
 *       200:
 *         description: Brand fetched successfully
 */

router.route("/:id").get(handleGetSingleBrand);

/**
 * @swagger
 * /api/brand/{id}:
 *   put:
 *     summary: Update a brand by id
 *     security:
 *       - bearerAuth: []
 *     tags: [Brand]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The id of the brand
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
 *                 description: The name of the brand
 *               slug:
 *                 type: string
 *                 description: The slug of the brand
 *               description:
 *                 type: string
 *                 description: The description of the brand
 *               active:
 *                 type: boolean
 *                 description: The active status of the brand
 *               image:
 *                 type: file
 *                 format: binary
 *                 description: The image of the brand
 *                 required: false
 *                 example:
 *                   image: image.jpg
 *                   alt: Brand image
 *     responses:
 *       200:
 *         description: Brand updated successfully
 */

router.route("/:id").put(isAdmin, upload.single('image'), validateRequest, handleUpdateBrand);

module.exports = router;