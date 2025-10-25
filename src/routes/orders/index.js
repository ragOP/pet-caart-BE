const express = require('express');
const router = express.Router();
const {
   createOrder,
   getOrderById,
   getAllUserOrders,
   getAllOrders,
   getOrderByIdAdmin,
   updateOrderStatus,
   createShipRocketOrder,
   handleAddAwbInfo,
} = require('../../controllers/orders');
const { validateRequest } = require('../../middleware/validateRequest');
const { isUser, isAdmin } = require('../../middleware/auth/adminMiddleware');

router.route('/').post(isUser, validateRequest, createOrder);
router.route('/get-all-user-orders').get(isUser, validateRequest, getAllUserOrders);
router.route('/get-all-orders').get(isAdmin, validateRequest, getAllOrders);
router.route('/get-order-by-id/:id').get(isAdmin, validateRequest, getOrderByIdAdmin);
router.route('/:id').get(isUser, validateRequest, getOrderById);
router.route('/:id/update-status').put(isAdmin, validateRequest, updateOrderStatus);
router.route('/:id/create-shiprocket-order').post(isAdmin, validateRequest, createShipRocketOrder);
router.route('/:id/add-awb-info').post(isAdmin, validateRequest, handleAddAwbInfo);

module.exports = router;
