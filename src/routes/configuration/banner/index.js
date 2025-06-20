const express = require('express');
const multer = require('multer');
const { storage } = require('../../../config/multer.js');
const { isAdmin } = require('../../../middleware/auth/adminMiddleware.js');
const { validateCreateBanner } = require('../../../validators/banners/index.js');
const { validateRequest } = require('../../../middleware/validateRequest/index');
const { handleCreateBanner, handleUpdateBanner, handleGetBanner } = require('../../../controllers/configuration/banner/index.js');
const router = express.Router();
const upload = multer({ storage: storage });

/**
 * @swagger
 * /api/configuration/banner:
 *   post:
 *     summary: Create a banner
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
 *               type:
 *                 type: string
 *                 enum: ['web', 'app', 'mobile', 'tablet']
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The image of the banner
 *     responses:
 *       201:
 *         description: Banner created successfully
 */
router
  .route('/banner')
  .post(isAdmin, upload.single('image'), validateRequest, handleCreateBanner);

/**
 * @swagger
 * /api/configuration/banner/{id}:
 *   put:
 *     summary: Update a banner
 *     tags: [Configuration]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the banner to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: ['web', 'app', 'mobile', 'tablet']
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The image of the banner
 *     responses:
 *       200:
 *         description: Banner updated successfully
 */     
router.route('/banner/:id').put(isAdmin, upload.single('image'), validateRequest, handleUpdateBanner);

/**
 * @swagger
 * /api/configuration/banner:
 *   get:
 *     summary: Get all banners
 *     tags: [Configuration]
 *     parameters:
 *       - name: type
 *         in: query
 *         required: true
 *         description: The type of the banner to get
 *     responses:
 *       200:
 *         description: Banners fetched successfully
 */
router.route('/banner').get(handleGetBanner);

module.exports = router;
