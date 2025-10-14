const express = require('express');
const {
   handleCreateProduct,
   handleGetAllProducts,
   handleGetSingleProduct,
   handleUpdateProduct,
   handleGetRecommendedProducts,
   handleDeleteProduct,
} = require('../../controllers/product/index.js');
const { validateCreateProduct } = require('../../validators/product/index.js');
const { validateRequest } = require('../../middleware/validateRequest/index');
const multer = require('multer');
const { storage } = require('../../config/multer.js');
const { isAdmin } = require('../../middleware/auth/adminMiddleware.js');
const router = express.Router();
const upload = multer({ storage: storage });

router.route('/').post(
   isAdmin,
   upload.fields([
      { name: 'images', maxCount: 20 },
      { name: 'variantImages', maxCount: 100 },
      { name: 'commonImages', maxCount: 20 },
   ]),
   validateRequest,
   handleCreateProduct
);
router.route('/').get(handleGetAllProducts);
router.route('/:id').get(handleGetSingleProduct);
router.route('/:id').put(
   upload.fields([
      { name: 'images', maxCount: 20 },
      { name: 'variantImages', maxCount: 100 },
      { name: 'commonImages', maxCount: 20 },
   ]),
   isAdmin,
   validateRequest,
   handleUpdateProduct
);
router.route('/recommendations/:id').get(handleGetRecommendedProducts);
router.delete('/delete/:id', isAdmin, handleDeleteProduct);

module.exports = router;
