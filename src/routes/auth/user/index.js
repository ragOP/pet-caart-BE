const express = require('express');
const {
  handleUserRegister,
  handleUserLogin,
  handleUpdateProfile,
} = require('../../../controllers/auth/user/index');
const { isAdmin, isUser } = require('../../../middleware/auth/adminMiddleware');
const { validateMobileAndOTP } = require('../../../validators/auth/index');
const { validateRequest } = require('../../../middleware/validateRequest/index');
const router = express.Router();

router.route('/login').post(validateMobileAndOTP, validateRequest, handleUserLogin);
router.route('/update-profile').put(isUser, validateRequest, handleUpdateProfile);

module.exports = router;
