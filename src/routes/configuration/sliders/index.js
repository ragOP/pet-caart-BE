const express = require('express');
const multer = require('multer');
const { storage } = require('../../../config/multer.js');
const { isAdmin } = require('../../../middleware/auth/adminMiddleware.js');
const {
  handleCreateSlider,
  handleGetSlider,
  handleUpdateSlider,
} = require('../../../controllers/configuration/sliders/index.js');
const router = express.Router();
const upload = multer({ storage: storage });

/**
 * @swagger
 * /api/sliders/slider:
 *   post:
 *     summary: Create a slider
 *     tags: [Configuration]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: string
 *                 format: binary
 *               link:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *               type:
 *                 type: string
 *                 enum:
 *                   - web
 *                   - app
 *                   - mobile
 *                   - tablet
 *     responses:
 *       201:
 *         description: Slider created successfully
 */

router.route('/slider').post(isAdmin, upload.single('images'), handleCreateSlider);

/**
 * @swagger
 * /api/sliders/slider:
 *   get:
 *     summary: Get all sliders
 *     tags: [Configuration]
 *     parameters:
 *       - name: type
 *         in: query
 *         required: true
 *         description: The type of the slider
 *         enum:
 *           - web
 *           - app
 *           - mobile
 *           - tablet
 *     responses:
 *       200:
 *         description: Sliders fetched successfully
 */

router.route('/slider').get(handleGetSlider);

/**
 * @swagger
 * /api/sliders/slider/{id}:
 *   put:
 *     summary: Update a slider
 *     tags: [Configuration]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the slider to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: string
 *                 format: binary
 *               link:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *               type:
 *                 type: string
 *                 enum:
 *                   - web
 *                   - app
 *                   - mobile
 *     responses:
 *       200:
 *         description: Slider updated successfully
 */

router.route('/slider/:id').put(isAdmin, upload.single('images'), handleUpdateSlider);

module.exports = router;
