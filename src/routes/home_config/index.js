const express = require('express');
const { validateRequest } = require('../../middleware/validateRequest/index');
const multer = require('multer');
const { storage } = require('../../config/multer.js');
const { isAdmin } = require('../../middleware/auth/adminMiddleware.js');
const {
   handleCreateNewHomeConfig,
   handleGetAllGridConfig,
   handleGetOneGridConfig,
   handleDeleteGridConfig,
   handleUpdateGridConfig,
   handleUpdateGridConfigPosition,
} = require('../../controllers/home_config/index.js');
const router = express.Router();
const upload = multer({ storage: storage });

router.route('/create').post(
   isAdmin,
   upload.fields([
      { name: 'backgroundImage', maxCount: 1 },
      { name: 'bannerImage', maxCount: 1 },
   ]),
   validateRequest,
   handleCreateNewHomeConfig
);

router.route('/get-all-grid').get(validateRequest, handleGetAllGridConfig);
router.route('/get-one-grid/:id').get(validateRequest, handleGetOneGridConfig);
router.route('/delete-grid/:id').delete(isAdmin, validateRequest, handleDeleteGridConfig);
router.route('/update-grid/:id').put(isAdmin, validateRequest, handleUpdateGridConfig);
router
   .route('/update-grid-position/:id')
   .put(isAdmin, validateRequest, handleUpdateGridConfigPosition);

module.exports = router;
