const express = require('express');
const { validateRequest } = require('../../middleware/validateRequest/index');
const multer = require('multer');
const { storage } = require('../../config/multer.js');
const { handleUploadImage } = require('../../controllers/upload_image/index.js');
const router = express.Router();
const upload = multer({ storage: storage });

router.route('/upload-image').post(upload.single('image'), validateRequest, handleUploadImage);

module.exports = router;