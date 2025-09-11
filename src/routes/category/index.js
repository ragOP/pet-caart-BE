const express = require('express');
const {
  handleCreateCategory,
  handleGetAllCategories,
  handleGetSingleCategory,
  handleUpdateCategory,
} = require('../../controllers/category/index.js');
const { validateCreateCategory } = require('../../validators/category/index.js');
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
    validateCreateCategory,
    validateRequest,
    handleCreateCategory
  );
router.route('/').get(handleGetAllCategories);
router.route('/:id').get(handleGetSingleCategory);
router.route('/:id').put(upload.single('images'), isAdmin, validateRequest, handleUpdateCategory);

module.exports = router;
