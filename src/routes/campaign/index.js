const express = require('express');
const { isAdmin } = require('../../middleware/auth/adminMiddleware');
const {
   handleStartCampaign,
   handleGetAllCampaigns,
   handleGetSingleCampaign,
} = require('../../controllers/campaign/index.js');
const router = express.Router();

router.route('/start-campaign').post(isAdmin, handleStartCampaign);
router.route('/get-all-campaigns').get(isAdmin, handleGetAllCampaigns);
router.route('/get-single-campaign/:id').get(isAdmin, handleGetSingleCampaign);

module.exports = router;
