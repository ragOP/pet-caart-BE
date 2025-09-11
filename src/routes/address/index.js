const express = require('express');
const { isUser } = require('../../middleware/auth/adminMiddleware');
const {
  handleCreateAddress,
  handleUpdateAddress,
  handleDeleteAddress,
  handleGetAllSavedAddresses,
} = require('../../controllers/address');
const { validateRequest } = require('../../middleware/validateRequest');
const router = express.Router();

router.route('/').post(isUser, validateRequest, handleCreateAddress);
router.route('/:id').put(isUser, validateRequest, handleUpdateAddress);
router.route('/:id').delete(isUser, handleDeleteAddress);
router.route('/').get(isUser, handleGetAllSavedAddresses);

module.exports = router;
