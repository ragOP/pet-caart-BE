const express = require('express');
const {
   handleAllUsers,
   handleGetUserById,
   handleUpdateUser,
   handleGetWalletBalance,
} = require('../../controllers/auth/user/index');
const { isAdmin, isUser } = require('../../middleware/auth/adminMiddleware');
const { validateRequest } = require('../../middleware/validateRequest/index');
const router = express.Router();

router.route('/all').get(isAdmin, validateRequest, handleAllUsers);
router.route('/user/:id').get(isAdmin, validateRequest, handleGetUserById);
router.route('/user/update/:id').put(isAdmin, validateRequest, handleUpdateUser);
router.route('/check-user-wallet').get(isUser, validateRequest, handleGetWalletBalance);

module.exports = router;
