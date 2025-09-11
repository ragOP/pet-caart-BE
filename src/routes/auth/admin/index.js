const express = require('express');
const { handleAdminLogin } = require('../../../controllers/auth/admin/index');
const { validateMobileAndOTP } = require('../../../validators/auth/index');
const { validateRequest } = require('../../../middleware/validateRequest/index');
const router = express.Router();

router.route('/login').post(validateMobileAndOTP, validateRequest, handleAdminLogin);

module.exports = router;
