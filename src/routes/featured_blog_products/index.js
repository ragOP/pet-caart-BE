const express = require('express');
const multer = require('multer');
const router = express.Router();

const {
  handleCreateBlogFeaturedProduct,
  handleGetFeaturedProducts,
  handleDeleteFeaturedProduct,
  handleUpdateFeaturedProduct,
} = require('../../controllers/featured_blog_products/index.js');
const { storage } = require('../../config/multer.js');
const { isAdmin } = require('../../middleware/auth/adminMiddleware');
const { validateRequest } = require('../../middleware/validateRequest');
const upload = multer({ storage: storage });

router
  .route('/create')
  .post(isAdmin, validateRequest, upload.single('bannerImage'), handleCreateBlogFeaturedProduct);
router.route('/get-featured-products').get(handleGetFeaturedProducts);
router
  .route('/delete-featured-product/:id')
  .delete(isAdmin, validateRequest, handleDeleteFeaturedProduct);
router
  .route('/update-featured-product/:id')
  .put(isAdmin, validateRequest, upload.single('bannerImage'), handleUpdateFeaturedProduct);

module.exports = router;
