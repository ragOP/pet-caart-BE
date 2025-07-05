const express = require('express');
const router = express.Router();
const couponController = require('../../controllers/coupon/index');
const { isAdmin, isUser } = require('../../middleware/auth/adminMiddleware');
const { validateRequest } = require('../../middleware/validateRequest');

/**
 * @swagger
 * /api/coupon:
 *   post:
 *     summary: Create a new coupon
 *     tags: [Coupon]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 description: The coupon code
 *               discountType:
 *                 type: string
 *                 enum: [percentage, fixed]
 *                 default: percentage
 *                 description: The discount type (percentage or fixed)
 *               discountValue:
 *                 type: number
 *                 description: The discount value
 *               maxDiscount:
 *                 type: number
 *                 description: The maximum discount value
 *               minPurchase:
 *                 type: number
 *                 description: The minimum purchase value
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: The start date of the coupon
 *               endDate:
 *                 type: date
 *                 description: The end date of the coupon
 *               totalUseLimit:
 *                 type: number
 *                 description: The total use limit of the coupon
 *               userUseLimit:
 *                 type: number
 *                 description: The user use limit of the coupon
 *               active:
 *                 type: boolean
 *                 description: The active status of the coupon
 *               applicableProducts:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: objectId
 *                   description: The product ID
 *                   example: 60d0fe4f5311236168a109ca
 *                 description: The products that the coupon is applicable to
 *               applicableCategories:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: objectId
 *                   description: The category ID
 *                   example: 60d0fe4f5311236168a109ca
 *                 description: The categories that the coupon is applicable to
 *               excludedProducts:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: objectId
 *                   description: The product ID
 *                   example: 60d0fe4f5311236168a109ca
 *                 description: The products that the coupon is not applicable to
 *               excludedCategories:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: objectId
 *                   description: The category ID
 *                   example: 60d0fe4f5311236168a109ca
 *                 description: The categories that the coupon is not applicable to
 *               autoApply:
 *                 type: boolean
 *                 description: The auto apply status of the coupon
 *     responses:
 *       200:
 *         description: Coupon created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/', isAdmin, validateRequest, couponController.createCoupon);

/**
 * @swagger
 * /api/coupon/all/admin:
 *   get:
 *     summary: Get all coupons
 *     tags: [Coupon]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         type: number
 *         description: The page number
 *       - name: per_page
 *         in: query
 *         type: number
 *         description: The number of coupons per page
 *       - name: search
 *         in: query
 *         type: string
 *         description: The search query
 *       - name: start_date
 *         in: query
 *         type: string
 *         description: The start date of the coupon
 *       - name: end_date
 *         in: query
 *         type: string
 *         description: The end date of the coupon
 *     responses:
 *       200:
 *         description: Coupons fetched successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/all/admin', isAdmin, validateRequest, couponController.getAdminCoupons);

/**
 * @swagger
 * /api/coupon/{code}/validate:
 *   get:
 *     summary: Validate a coupon
 *     tags: [Coupon]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: code
 *         in: path
 *         type: string
 *         description: The coupon code
 *     responses:
 *       200:
 *         description: Coupon validated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/:code/validate', isUser, couponController.validateCoupon);

/**
 * @swagger
 * /api/coupon/{id}:
 *   get:
 *     summary: Get a coupon by ID
 *     tags: [Coupon]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         type: string
 *         description: The coupon ID
 *     responses:
 *       200:
 *         description: Coupon fetched successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/:id', isAdmin, validateRequest, couponController.getCouponByCode);
router.post('/:code/apply', isUser, validateRequest, couponController.applyCoupon);

/**
 * @swagger
 * /api/coupon:
 *   get:
 *     summary: Get all coupons
 *     tags: [Coupon]
 *     parameters:
 *       - name: page
 *         in: query
 *         type: number
 *         description: The page number
 *       - name: per_page
 *         in: query
 *         type: number
 *         description: The number of coupons per page
 *       - name: search
 *         in: query
 *         type: string
 *         description: The search query
 *       - name: start_date
 *         in: query
 *         type: string
 *         description: The start date of the coupon
 *       - name: end_date
 *         in: query
 *         type: string
 *         description: The end date of the coupon
 *       - name: showOnlyValid
 *         in: query
 *         type: boolean
 *         description: The show only valid coupons
 *       - name: isAdmin
 *         in: query
 *         type: boolean
 *         description: The isAdmin status of the coupon
 *     responses:
 *       200:
 *         description: Coupons fetched successfully
 */
router.get('/', couponController.getAllCoupons);

/**
 * @swagger
 * /api/coupon/{id}:
 *   delete:
 *     summary: Delete a coupon
 *     tags: [Coupon]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         type: string
 *         description: The coupon ID
 *     responses:
 *       200:
 *         description: Coupon deleted successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id', isAdmin, validateRequest, couponController.deleteCoupon);

/**
 * @swagger
 * /api/coupon/{id}:
 *   put:
 *     summary: Update a coupon
 *     tags: [Coupon]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         type: string
 *         description: The coupon ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 description: The coupon code
 *               discountType:
 *                 type: string
 *                 description: The discount type (percentage or fixed)
 *               discountValue:
 *                 type: number
 *                 description: The discount value
 *               maxDiscount:
 *                 type: number
 *                 description: The maximum discount value
 *               minPurchase:
 *                 type: number
 *               startDate:
 *                 type: string
 *                 description: The start date of the coupon
 *               endDate:
 *                 type: string
 *                 description: The end date of the coupon
 *               totalUseLimit:
 *                 type: number
 *                 description: The total use limit of the coupon
 *               userUseLimit:
 *                 type: number
 *                 description: The user use limit of the coupon
 *               active:
 *                 type: boolean
 *               applicableProducts:
 *                 type: array
 *                 description: The products that the coupon is applicable to
 *               applicableCategories:
 *                 type: array
 *                 description: The categories that the coupon is applicable to
 *               excludedProducts:
 *                 type: array
 *                 description: The products that the coupon is not applicable to
 *               excludedCategories:
 *                 type: array
 *                 description: The categories that the coupon is not applicable to
 *               autoApply:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Coupon updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.put('/:id', isAdmin, validateRequest, couponController.updateCoupon);

module.exports = router;
