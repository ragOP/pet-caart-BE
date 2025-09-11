const express = require('express');
const multer = require('multer');
const { storage } = require('../../../config/multer.js');
const { isAdmin } = require('../../../middleware/auth/adminMiddleware.js');
const { validateCreateBanner } = require('../../../validators/banners/index.js');
const { validateRequest } = require('../../../middleware/validateRequest/index');
const {
  handleCreateBanner,
  handleUpdateBanner,
  handleGetBanner,
  handleCreateAdBanner,
  handleGetAdBanner,
} = require('../../../controllers/configuration/banner/index.js');
const router = express.Router();
const upload = multer({ storage: storage });

router.route('/banner').post(isAdmin, upload.single('image'), validateRequest, handleCreateBanner);
router
  .route('/banner/:id')
  .put(isAdmin, upload.single('image'), validateRequest, handleUpdateBanner);

router.route('/banner').get(handleGetBanner);
router.route('/ad-banner').post(isAdmin, validateRequest, handleCreateAdBanner);
router.route('/ad-banner').get(handleGetAdBanner);

module.exports = router;
