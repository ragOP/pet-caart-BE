const express = require('express');
const multer = require('multer');
const { storage } = require('../../config/multer.js');
const { isAdmin } = require('../../middleware/auth/adminMiddleware.js');
const {
   handleCreateBlog,
   handleGetAllBlogs,
   handleGetSingleBlog,
   handleDeleteBlog,
   handleUpdateBlog,
   handleYouMayLike,
   handleGetLatestBlogs,
} = require('../../controllers/blog/index.js');
const { validateRequest } = require('../../middleware/validateRequest/index.js');
const router = express.Router();
const upload = multer({ storage: storage });

router.route('/').post(upload.single('image'), isAdmin, validateRequest, handleCreateBlog);
router.route('/').get(validateRequest, handleGetAllBlogs);
router.route('/get-single-blog/:id').get(validateRequest, handleGetSingleBlog);
router.route('/delete/:id').delete(handleDeleteBlog);
router.route('/edit/blog/:id').put(upload.single('image'), handleUpdateBlog);
router.route('/you-may-like').get(handleYouMayLike);
router.route('/get-latest-blogs').get(handleGetLatestBlogs);

module.exports = router;
