const express = require('express');
const {
  handleCreateReview,
  handleGetAllProductReviews,
  handleCheckIfUserBoughtProduct,
} = require('../../controllers/reviews');
const { validateRequest } = require('../../middleware/validateRequest/index');
const { isUser } = require('../../middleware/auth/adminMiddleware');
const router = express.Router();

router.route('/create').post(isUser, validateRequest, handleCreateReview);
router.route('/get-all-reviews/:id').get(validateRequest, handleGetAllProductReviews);
router
  .route('/check-if-user-bought-product/:id')
  .get(isUser, validateRequest, handleCheckIfUserBoughtProduct);

module.exports = router;
