const express = require('express');
const multer = require('multer');
const { storage } = require('../../../config/multer.js');
const { isAdmin } = require('../../../middleware/auth/adminMiddleware.js');
const {
  handleCreateProductBanner,
  handleGetProductBanner,
  handleUpdateProductBanner,
} = require('../../../controllers/configuration/productBanner/index.js');
const router = express.Router();
const upload = multer({ storage: storage });

router.route('/create').post(isAdmin, upload.single('image'), handleCreateProductBanner);
router.route('/get').get(handleGetProductBanner);
router.route('/update').put(isAdmin, upload.single('image'), handleUpdateProductBanner);

module.exports = router;
