const express = require("express");
const { handleCreateProduct, handleGetAllProducts, handleGetSingleProduct } = require('../../controllers/product/index.js');
const { validateCreateProduct } = require('../../validators/product/index.js');
const { validateRequest } = require('../../middleware/validateRequest/index')
const multer = require("multer");
const { storage } = require("../../config/multer.js");
const { isAdmin } = require("../../middleware/auth/adminMiddleware.js");
const router = express.Router();
const upload = multer({ storage: storage });

router.route("/").post(isAdmin, upload.array("images", maxCount = 10), validateRequest, handleCreateProduct);

router.route("/").get(handleGetAllProducts);

router.route("/:id").get(handleGetSingleProduct);

module.exports = router;