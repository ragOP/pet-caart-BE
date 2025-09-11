const express = require('express');
const multer = require('multer');
const { storage } = require('../../../config/multer.js');
const { isAdmin } = require('../../../middleware/auth/adminMiddleware.js');
const { validateRequest } = require('../../../middleware/validateRequest/index');
const {
   handleCreateCatLifeBanner,
   handleGetCatLifeBanners,
   handleUpdateCatLifeBanner,
   handleGetCatLifeBannerById,
} = require('../../../controllers/configuration/catLifeBanner/index.js');
const router = express.Router();
const upload = multer({ storage: storage });
router
   .route('/create')
   .post(upload.single('image'), isAdmin, validateRequest, handleCreateCatLifeBanner);
router.route('/get').get(handleGetCatLifeBanners);
router
   .route('/update/:id')
   .put(upload.single('image'), isAdmin, validateRequest, handleUpdateCatLifeBanner);
router.route('/get-by-id/:id').get(handleGetCatLifeBannerById);

module.exports = router;
