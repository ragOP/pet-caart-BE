const express = require('express');
const { validateRequest } = require('../../middleware/validateRequest/index');
const multer = require('multer');
const { storage } = require('../../config/multer.js');
const { handleUploadImage } = require('../../controllers/upload_image/index.js');
const router = express.Router();
const upload = multer({ storage: storage });

/**
 * @swagger
 * /api/image/upload-image:
 *   post:
 *     summary: Upload a single image
 *     description: Upload a single image file to the server and receive the URL of the uploaded image.
 *     tags: [Image]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The image file to upload
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Internal server error
 */
router.route('/upload-image').post(upload.single('image'), validateRequest, handleUploadImage);

module.exports = router;