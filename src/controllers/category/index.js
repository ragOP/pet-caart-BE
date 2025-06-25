const { asyncHandler } = require('../../utils/asyncHandler/index');
const ApiResponse = require('../../utils/apiResponse/index');
const { createCategory, getCategories, getSingleCategory, updateCategory } = require('../../services/category/index');
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
  const { search, page = 1, limit = 25, start_date, end_date } = req.query;
  const result = await getCategories(search, page, limit, start_date, end_date);
  return res.status(200).json(new ApiResponse(200, result, "Categories fetched successfully", true));
});

exports.handleGetSingleCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json(new ApiResponse(400, null, "Category id is required"));
  }
  const result = await getSingleCategory(id);
  return res.status(200).json(new ApiResponse(200, result, "Category fetched successfully", true));
});

exports.handleUpdateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.admin?._id;
  const image = req.file;
  if (!id) {
    return res.status(400).json(new ApiResponse(400, null, "Category id is required"));
  }
  const result = await updateCategory(id, req.body, image, userId);
  if (!result) {
    return res.status(404).json(new ApiResponse(404, null, "Category not found"));
  }
  return res.status(200).json(new ApiResponse(200, result, "Category updated successfully", true));
});