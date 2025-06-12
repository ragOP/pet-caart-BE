const { asyncHandler } = require('../../utils/asyncHandler/index');
const ApiResponse = require('../../utils/apiResponse/index');
const { createCategory, getCategories } = require('../../services/category/index');
const { uploadSingleFile } = require('../../utils/upload/index');

exports.handleCreateCategory = asyncHandler(async (req, res) => {
      const images = req.files;
  if (!images) {
    return res.json(new ApiResponse(404, null, "No Image Found", false));
  }

  const imageUrl = await uploadSingleFile(images[0].path);

  const { name, slug, description } = req.body;
  const createdBy = req.admin?._id;

  const result = await createCategory({ name, slug, image: imageUrl, description, createdBy });
  return res.status(201).json(new ApiResponse(201, result, "Category created successfully", true));
});

exports.handleGetAllCategories = asyncHandler(async (req, res) => {
  const result = await getCategories();
  return res.status(200).json(new ApiResponse(200, result, "Categories fetched successfully", true));
});
