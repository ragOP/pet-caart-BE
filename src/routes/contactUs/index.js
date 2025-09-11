const express = require('express');
const { isAdmin } = require('../../middleware/auth/adminMiddleware');
const { validateRequest } = require('../../middleware/validateRequest');
const {
  handleContactUs,
  handleGetAllContactUs,
  handleUpdateContactUs,
} = require('../../controllers/contactUs');
const router = express.Router();

router.route('/').post(validateRequest, handleContactUs);
router.route('/').get(isAdmin, validateRequest, handleGetAllContactUs);
router.route('/:id').put(isAdmin, validateRequest, handleUpdateContactUs);

module.exports = router;
