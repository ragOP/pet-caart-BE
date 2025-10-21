const express = require('express');
const { isAdmin } = require('../../middleware/auth/adminMiddleware');
const { validateRequest } = require('../../middleware/validateRequest');
const {
   handleGetMonthlyStats,
   handleGetCustomerStats,
   handleGetGrowthRate,
   handleGetTopCategories,
   handleGetTopSubCategories,
   handleGetTopProducts,
   handleGetTotalSales,
} = require('../../controllers/stats');
const router = express.Router();

router.route('/get-monthly-stats').get(isAdmin, validateRequest, handleGetMonthlyStats);
router.route('/get-customer-stats').get(isAdmin, validateRequest, handleGetCustomerStats);
router.route('/get-growth-rate').get(isAdmin, validateRequest, handleGetGrowthRate);
router.route('/get-top-categories').get(isAdmin, validateRequest, handleGetTopCategories);
router.route('/get-top-subcategories').get(isAdmin, validateRequest, handleGetTopSubCategories);
router.route('/get-top-products').get(isAdmin, validateRequest, handleGetTopProducts);
router.route('/get-total-sales').get(isAdmin, validateRequest, handleGetTotalSales);

module.exports = router;
