const express = require('express');
const { validateRequest } = require('../../middleware/validateRequest/index');
const multer = require('multer');
const { storage } = require('../../config/multer.js');
const { isAdmin } = require('../../middleware/auth/adminMiddleware.js');
const {
  handleCreateNewHomeConfig,
  handleGetAllGridConfig,
  handleGetOneGridConfig,
  handleDeleteGridConfig,
  handleUpdateGridConfig
} = require('../../controllers/home_config/index.js');
const router = express.Router();
const upload = multer({ storage: storage });

/**
 * @swagger
 * /api/home-config/create:
 *   post:
 *     summary: Create a new home section configuration
 *     description: This route allows admin users to create a new home section configuration.
 *     tags: [HomeConfig]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               contentType:
 *                 type: string
 *                 enum: [product, category, subCategory, collection]
 *               contentItems:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     itemId:
 *                       type: string
 *                     link:
 *                       type: string
 *                     imageUrl:
 *                       type: string
 *               grid:
 *                 type: object
 *                 properties:
 *                   columns:
 *                     type: integer
 *                   rows:
 *                     type: integer
 *               isActive:
 *                 type: boolean
 *               position:
 *                 type: integer
 *               backgroundImage:
 *                 type: string
 *                 description: URL of the background image
 *               bannerImage:
 *                 type: string
 *                 description: URL of the banner image
 *     responses:
 *       200:
 *         description: Home section created successfully
 *       500:
 *         description: Failed to create home section
 */

router.route('/create').post(
  upload.fields([
    { name: 'backgroundImage', maxCount: 1 },
    { name: 'bannerImage', maxCount: 1 },
  ]),
  validateRequest,
  handleCreateNewHomeConfig
);

/**
 * @swagger
 * /api/home-config/get-all-grid:
 *   get:
 *     summary: Get all grid configurations
 *     description: This route allows admin users to retrieve all grid configurations.
 *     tags: [HomeConfig]
 *     responses:
 *       200:
 *         description: Grid configurations retrieved successfully
 *       500:
 *         description: Failed to retrieve grid configurations
 */

router.route('/get-all-grid').get(validateRequest, handleGetAllGridConfig);

/**
 * @swagger
 * /api/home-config/get-one-grid/{id}:
 *   get:
 *     summary: Get a single grid configuration
 *     description: This route allows admin users to retrieve a single grid configuration by ID.
 *     tags: [HomeConfig]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the grid configuration to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Grid configuration retrieved successfully
 *       500:
 *         description: Failed to retrieve grid configuration
 */
router.route('/get-one-grid/:id').get(validateRequest, handleGetOneGridConfig);

/**
 * @swagger
 * /api/home-config/delete-grid/{id}:
 *   delete:
 *     summary: Delete a grid configuration
 *     description: This route allows admin users to delete a grid configuration by ID.
 *     tags: [HomeConfig]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the grid configuration to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Grid configuration deleted successfully
 *       500:
 *         description: Failed to delete grid configuration
 */
router.route('/delete-grid/:id').delete(validateRequest, handleDeleteGridConfig);

/**
 * @swagger
 * /api/home-config/update-grid/{id}:
 *   put:
 *     summary: Update a grid configuration
 *     description: This route allows admin users to update a grid configuration by ID.
 *     tags: [HomeConfig]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the grid configuration to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               contentType:
 *                 type: string
 *                 enum: [product, category, subCategory, collection]
 *               contentItems:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     itemId:
 *                       type: string
 *                     link:
 *                       type: string
 *                     imageUrl:
 *                       type: string
 *               grid:
 *                 type: object
 *                 properties:
 *                   columns:
 *                     type: integer
 *                   rows:
 *                     type: integer
 *               isActive:
 *                 type: boolean
 *               position:
 *                 type: integer
 *               backgroundImage:
 *                 type: string
 *                 description: URL of the background image
 *               bannerImage:
 *                 type: string
 *                 description: URL of the banner image
 *     responses:
 *       200:
 *         description: Grid configuration updated successfully
 *       500:
 *         description: Failed to update grid configuration
 */

router.route('/update-grid/:id').put(validateRequest, handleUpdateGridConfig);

module.exports = router;
