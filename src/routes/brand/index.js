const express = require('express');
const {
  handleCreateBrand,
  handleGetAllBrands,
  handleGetSingleBrand,
  handleUpdateBrand,
} = require('../../controllers/brand/index.js');
const { validateCreateBrand } = require('../../validators/brand/index.js');
const { validateRequest } = require('../../middleware/validateRequest/index');
const multer = require('multer');
const { storage } = require('../../config/multer.js');
const { isAdmin } = require('../../middleware/auth/adminMiddleware.js');
const router = express.Router();
const upload = multer({ storage: storage });

router
  .route('/')
  .post(isAdmin, upload.array('images'), validateCreateBrand, validateRequest, handleCreateBrand);
router.route('/').get(handleGetAllBrands);
router.route('/:id').get(handleGetSingleBrand);
router.route('/:id').put(isAdmin, upload.single('images'), validateRequest, handleUpdateBrand);

module.exports = router;
