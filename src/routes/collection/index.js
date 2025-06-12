const express = require("express");
const { handleCreateCollection, handleGetAllCollections } = require('../../controllers/collection/index.js');
const { validateCreateCollection } = require('../../validators/collection/index.js');
const { validateRequest } = require('../../middleware/validateRequest/index')
const multer = require("multer");
const { storage } = require("../../config/multer.js");
const { isAdmin } = require("../../middleware/auth/adminMiddleware.js");
const router = express.Router();

const upload = multer({ storage: storage });

router.route("/").post(isAdmin, upload.array("images"), validateCreateCollection, validateRequest, handleCreateCollection);

router.route("/").get(handleGetAllCollections);

module.exports = router;