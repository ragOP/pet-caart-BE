const express = require('express');
const multer = require('multer');
const { storage } = require('../../../config/multer.js');
const { isAdmin } = require('../../../middleware/auth/adminMiddleware.js');
const { validateRequest } = require('../../../middleware/validateRequest/index');
const {
  handleGetHeaderFooter,
  handleCreateHeaderFooter,
} = require('../../../controllers/configuration/headerFooter/index.js');
const router = express.Router();
const upload = multer({ storage: storage });

router.route('/header-footer/get').get(handleGetHeaderFooter);
router
  .route('/header-footer/create')
  .post(upload.single('logo'), isAdmin, validateRequest, handleCreateHeaderFooter);

module.exports = router;
