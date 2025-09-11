const express = require('express');
const multer = require('multer');
const { storage } = require('../../../config/multer.js');
const { isAdmin } = require('../../../middleware/auth/adminMiddleware.js');
const {
  handleCreateSlider,
  handleGetSlider,
  handleUpdateSlider,
  handleGetSliderById,
  handleDeleteSlider,
  handleGetAllSlider,
} = require('../../../controllers/configuration/sliders/index.js');
const router = express.Router();
const upload = multer({ storage: storage });

router.route('/slider').post(isAdmin, upload.single('images'), handleCreateSlider);
router.route('/slider').get(handleGetSlider);
router.route('/slider/:id').put(isAdmin, upload.single('images'), handleUpdateSlider);
router.route('/slider/:id').get(isAdmin, handleGetSliderById);
router.route('/slider/:id').delete(isAdmin, handleDeleteSlider);
router.route('/admin/slider').get(isAdmin, handleGetAllSlider);
module.exports = router;
