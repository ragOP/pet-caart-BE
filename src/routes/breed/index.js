const express = require("express");
const { handleCreateBreed, handleGetAllBreeds, handleGetSingleBreed } = require('../../controllers/breed/index.js');
const { validateCreateBreed } = require('../../validators/breed/index.js');
const { validateRequest } = require('../../middleware/validateRequest/index')
const multer = require("multer");
const { storage } = require("../../config/multer.js");
const { isAdmin } = require("../../middleware/auth/adminMiddleware.js");
const router = express.Router();
const upload = multer({ storage: storage });

router.route("/").post(isAdmin, upload.array("images"), validateCreateBreed, validateRequest, handleCreateBreed);

router.route("/").get(handleGetAllBreeds);

router.route("/:id").get(handleGetSingleBreed);

module.exports = router;