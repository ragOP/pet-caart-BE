const express = require('express');
const router = express.Router();
const couponController = require('../../controllers/coupon/index');
const { isAdmin, isUser } = require('../../middleware/auth/adminMiddleware');
const { validateRequest } = require('../../middleware/validateRequest');

router.post('/', isAdmin, validateRequest, couponController.createCoupon);
router.get('/all/admin', isAdmin, validateRequest, couponController.getAdminCoupons);
router.get('/:code/validate', isUser, couponController.validateCoupon);
router.get('/:id', isAdmin, validateRequest, couponController.getCouponByCode);
router.post('/:code/apply', isUser, validateRequest, couponController.applyCoupon);
router.get('/', couponController.getAllCoupons);
router.delete('/:id', isAdmin, validateRequest, couponController.deleteCoupon);
router.put('/:id', isAdmin, validateRequest, couponController.updateCoupon);

module.exports = router;
