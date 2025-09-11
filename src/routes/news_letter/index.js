const express = require('express');
const router = express.Router();

const {
  handleSubscribe,
  handleUnsubscribe,
  handleGetAllSubscribers,
} = require('../../controllers/news_letter/index.js');

const { isAdmin } = require('../../middleware/auth/adminMiddleware');
const { validateRequest } = require('../../middleware/validateRequest');

router.route('/subscribe').post(validateRequest, handleSubscribe);
router.route('/unsubscribe').post(validateRequest, handleUnsubscribe);
router.route('/get-all-subscribers').get(isAdmin, handleGetAllSubscribers);

module.exports = router;
