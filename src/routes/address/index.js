const express = require('express');
const { isUser, isAdmin } = require('../../middleware/auth/adminMiddleware');
const {
   handleCreateAddress,
   handleUpdateAddress,
   handleDeleteAddress,
   handleGetAllSavedAddresses,
   handleGetAllSavedAddressesAdmin,
} = require('../../controllers/address');
const { validateRequest } = require('../../middleware/validateRequest');
const router = express.Router();

router.route('/').post(isUser, validateRequest, handleCreateAddress);
router.route('/:id').put(isUser, validateRequest, handleUpdateAddress);
router.route('/:id').delete(isUser, handleDeleteAddress);
router.route('/').get(isUser, handleGetAllSavedAddresses);
router.route('/get-address/admin/:id').get(isAdmin, handleGetAllSavedAddressesAdmin);

module.exports = router;
