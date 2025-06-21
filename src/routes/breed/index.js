const express = require("express");
const { handleCreateBreed, handleGetAllBreeds, handleGetSingleBreed } = require('../../controllers/breed/index.js');
const { validateCreateBreed } = require('../../validators/breed/index.js');
const { validateRequest } = require('../../middleware/validateRequest/index')
const multer = require("multer");
const { storage } = require("../../config/multer.js");
const { isAdmin } = require("../../middleware/auth/adminMiddleware.js");
const router = express.Router();
const upload = multer({ storage: storage });

/**
 * @swagger
 * /api/breed:
 *   post:
 *     summary: Create a breed
 *     tags: [Breed]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the breed
 *               slug:
 *                 type: string
 *                 description: The slug of the breed
 *               description:
 *                 type: string
 *                 description: The description of the breed
 *               active:
 *                 type: boolean
 *                 description: The active status of the breed
 *               images:
 *                 type: array
 *                 description: The images of the breed
 *                 items:
 *                   type: file
 *                   format: binary
 *                   description: The image of the breed
 *                   required: true
 *                   maxItems: 10
 *                   minItems: 1
 *                   uniqueItems: true
 *                   example:
 *                     - image: image.jpg
 *                       alt: Breed image
 *     responses:
 *       201:
 *         description: Breed created successfully
 */

router.route("/").post(isAdmin, upload.array("images"), validateCreateBreed, validateRequest, handleCreateBreed);

/**
 * @swagger
 * /api/breed/get:
 *   get:
 *     summary: Get all breeds
 *     tags: [Breed]
 *     parameters:
 *       - name: search
 *         in: query
 *         required: false
 *         description: The search query
 *         type: string
 *       - name: page
 *         in: query
 *         required: false
 *         description: The page number
 *         type: number
 *       - name: per_page
 *         in: query
 *         required: false
 *         description: The number of items per page
 *         type: number
 *       - name: start_date
 *         in: query
 *         required: false
 *         description: The start date
 *         type: string
 *       - name: end_date
 *         in: query
 *         required: false
 *         description: The end date
 *         type: string
 * 
 *     responses:
 *       200:
 *         description: Breeds fetched successfully
 */

router.route("/").get(handleGetAllBreeds);

/**
 * @swagger
 * /api/breed/{id}:
 *   get:
 *     summary: Get a breed by id
 *     tags: [Breed]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The id of the breed
 *         type: string
 *     responses:
 *       200:
 *         description: Breed fetched successfully
 */

router.route("/:id").get(handleGetSingleBreed);

module.exports = router;