const { asyncHandler } = require('../../utils/asyncHandler/index');
const ApiResponse = require('../../utils/apiResponse/index');
const {
  createSubCategory,
  getAllSubCategories,
  getAllSubCategoriesByCategoryId,
  getSingleSubCategory,
} = require('../../services/sub_category/index');
const { uploadSingleFile } = require('../../utils/upload/index');
const mongoose = require('mongoose');

exports.handleGetAllSubCategories = asyncHandler(async (req, res) => {
  const { categoryId, search, page = 1, per_page = 50, start_date, end_date } = req.query;

  let result;
  if (categoryId && mongoose.Types.ObjectId.isValid(categoryId)) {
    result = await getAllSubCategoriesByCategoryId({
      categoryId,
      search,
      page,
      perPage: per_page,
      startDate: start_date,
      endDate: end_date,
    });
  } else {
    result = await getAllSubCategories({
      search,
      page,
      perPage: per_page,
      startDate: start_date,
      endDate: end_date,
    });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, result, 'SubCategories fetched successfully', true));
});

exports.handleGetSingleSubCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json(new ApiResponse(400, null, 'SubCategory id is required'));
  }

  const result = await getSingleSubCategory(id);
  return res
    .status(200)
    .json(new ApiResponse(200, result, 'SubCategory fetched successfully', true));
});

exports.handleCreateSubCategory = asyncHandler(async (req, res) => {
  const createdBy = req.admin?._id;
  if (!createdBy) {
    return res.status(403).json(new ApiResponse(403, null, 'Not authorized'));
  }

  const { name, slug, description, categoryId } = req.body;
  if (!categoryId) {
    return res.status(400).json(new ApiResponse(400, null, 'Category id is required'));
  }

  const images = req.files;
  if (!images) {
    return res.json(new ApiResponse(404, null, 'No Image Found', false));
  }

  const imageUrl = await uploadSingleFile(images[0].path);

  const result = await createSubCategory({
    name,
    slug,
    image: imageUrl,
    description,
    categoryId,
    createdBy,
  });
  return res
    .status(201)
    .json(new ApiResponse(201, result, 'SubCategory created successfully', true));
});
