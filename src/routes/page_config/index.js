const express = require('express');
const { validateRequest } = require('../../middleware/validateRequest/index');
const { isAdmin } = require('../../middleware/auth/adminMiddleware.js');

const {
   handleCreateNewPageConfig,
   handleUpdatePageConfig,
   handleGetAllGridConfigs,
   handleGetGridByKey,
} = require('../../controllers/page_config/index.js');

router = express.Router();

router.route('/add-page-config').post(isAdmin, validateRequest, handleCreateNewPageConfig);
router.route('/update-page-config/:id').put(isAdmin, validateRequest, handleUpdatePageConfig);
router.route('/get-all-page-configs').get(handleGetAllGridConfigs);
router.route('/get-page-config-by-key/:pageKey').get(handleGetGridByKey);

module.exports = router;
