const express = require('express');
const {
  handleAllUsers,
  handleGetUserById,
  handleUpdateUser,
} = require('../../controllers/auth/user/index');
const { isAdmin } = require('../../middleware/auth/adminMiddleware');
const { validateRequest } = require('../../middleware/validateRequest/index');
const router = express.Router();

router.route('/all').get(isAdmin, validateRequest, handleAllUsers);
router.route('/user/:id').get(isAdmin, validateRequest, handleGetUserById);
router.route('/user/update/:id').put(isAdmin, validateRequest, handleUpdateUser);

module.exports = router;
