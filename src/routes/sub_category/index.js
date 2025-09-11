const express = require('express');
const {
  handleCreateSubCategory,
  handleGetAllSubCategories,
  handleGetSingleSubCategory,
  handleUpdateSubCategory,
} = require('../../controllers/sub_category/index.js');
const { validateCreateSubCategory } = require('../../validators/sub_category/index.js');
const { validateRequest } = require('../../middleware/validateRequest/index');
const multer = require('multer');
const { storage } = require('../../config/multer.js');
const { isAdmin } = require('../../middleware/auth/adminMiddleware.js');
const router = express.Router();

const upload = multer({ storage: storage });

router
  .route('/')
  .post(
    isAdmin,
    upload.array('images'),
    validateCreateSubCategory,
    validateRequest,
    handleCreateSubCategory
  );
router.route('/').get(handleGetAllSubCategories);
router.route('/:id').get(handleGetSingleSubCategory);
router.route('/:id').put(upload.single('image'), isAdmin, validateRequest, handleUpdateSubCategory);

module.exports = router;
