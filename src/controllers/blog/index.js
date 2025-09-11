const ApiResponse = require('../../utils/apiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const {
   createBlog,
   getAllBlogs,
   getSingleBlog,
   deleteBlog,
   updateBlog,
   youMayLike,
   getLatestBlogs,
} = require('../../services/blog');

exports.handleCreateBlog = asyncHandler(async (req, res) => {
   const {
      title,
      content,
      slug,
      category,
      isPublished,
      isFeatured,
      tags,
      isBanner,
      description,
      relatedProducts,
   } = req.body;
   const image = req.file.path;

   const result = await createBlog(
      title,
      content,
      image,
      slug,
      category,
      isPublished,
      isFeatured,
      tags,
      isBanner,
      description,
      relatedProducts
   );
   if (!result.success) {
      return res
         .status(result.statusCode)
         .json(new ApiResponse(result.statusCode, result.data, result.message, result.success));
   }
   return res
      .status(result.statusCode)
      .json(new ApiResponse(result.statusCode, result.data, result.message, res, result.success));
});

exports.handleGetAllBlogs = asyncHandler(async (req, res) => {
   const { page, limit, search, category, isPublished, isFeatured, isBanner } = req.query;
   const result = await getAllBlogs(
      page,
      limit,
      search,
      category,
      isPublished,
      isFeatured,
      isBanner
   );
   if (!result.success) {
      return res
         .status(result.statusCode)
         .json(new ApiResponse(result.statusCode, result.data, result.message, result.success));
   }
   return res
      .status(result.statusCode)
      .json(new ApiResponse(result.statusCode, result.data, result.message, res, result.success));
});

exports.handleGetSingleBlog = asyncHandler(async (req, res) => {
   const { id } = req.params;
   const result = await getSingleBlog(id);
   if (!result.success) {
      return res
         .status(result.statusCode)
         .json(new ApiResponse(result.statusCode, result.data, result.message, result.success));
   }
   return res
      .status(result.statusCode)
      .json(new ApiResponse(result.statusCode, result.data, result.message, res, result.success));
});

exports.handleDeleteBlog = asyncHandler(async (req, res) => {
   const { id } = req.params;
   const result = await deleteBlog(id);
   if (!result.success) {
      return res
         .status(result.statusCode)
         .json(new ApiResponse(result.statusCode, result.data, result.message, result.success));
   }
   return res
      .status(result.statusCode)
      .json(new ApiResponse(result.statusCode, result.data, result.message, res, result.success));
});

exports.handleUpdateBlog = asyncHandler(async (req, res) => {
   const { id } = req.params;
   const {
      title,
      content,
      slug,
      category,
      isPublished,
      isFeatured,
      tags,
      isBanner,
      description,
      relatedProducts,
   } = req.body;

   let image = null;
   if (req.file) {
      image = req.file.path;
   }
   const result = await updateBlog(
      id,
      title,
      content,
      image,
      slug,
      category,
      isPublished,
      isFeatured,
      tags,
      isBanner,
      description,
      relatedProducts
   );
   if (!result.success) {
      return res
         .status(result.statusCode)
         .json(new ApiResponse(result.statusCode, result.data, result.message, result.success));
   }
   return res
      .status(result.statusCode)
      .json(new ApiResponse(result.statusCode, result.data, result.message, res, result.success));
});

exports.handleYouMayLike = asyncHandler(async (req, res) => {
   const result = await youMayLike();
   if (!result.success) {
      return res
         .status(result.statusCode)
         .json(new ApiResponse(result.statusCode, result.data, result.message, result.success));
   }
   return res
      .status(result.statusCode)
      .json(new ApiResponse(result.statusCode, result.data, result.message, res, result.success));
});

exports.handleGetLatestBlogs = asyncHandler(async (req, res) => {
   const result = await getLatestBlogs();
   if (!result.success) {
      return res
         .status(result.statusCode)
         .json(new ApiResponse(result.statusCode, result.data, result.message, result.success));
   }
   return res
      .status(result.statusCode)
      .json(new ApiResponse(result.statusCode, result.data, result.message, res, result.success));
});
