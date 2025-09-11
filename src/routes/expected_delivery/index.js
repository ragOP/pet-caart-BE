const express = require('express');
const router = express.Router();

const {
   checkExpectedDelivery,
   handleTrackDelivery,
} = require('../../controllers/expected_delivery/index');
const { validateRequest } = require('../../middleware/validateRequest');

router.route('/check').post(validateRequest, checkExpectedDelivery);
router.route('/track').post(validateRequest, handleTrackDelivery);

module.exports = router;
