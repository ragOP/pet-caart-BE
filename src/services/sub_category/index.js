const SubCategoryService = require('../../repositories/sub_category/index');
const { uploadSingleFile } = require('../../utils/upload');

exports.createSubCategory = async subCategory => {
  const newSubCategory = await SubCategoryService.createSubCategory(subCategory);
  return newSubCategory;
};

exports.getSingleSubCategory = async id => {
  const subCategory = await SubCategoryService.getSingleSubCategory(id);
  return subCategory;
};

exports.getAllSubCategories = async ({ search, page, perPage, startDate, endDate }) => {
  const filters = {};

  if (search) {
    filters.$or = [
      { name: { $regex: search, $options: 'i' } },
      { slug: { $regex: search, $options: 'i' } },
    ];
  }

  if (startDate || endDate) {
    filters.createdAt = {};
    if (startDate) filters.createdAt.$gte = new Date(startDate);
    if (endDate) filters.createdAt.$lte = new Date(endDate);
  }

  const skip = (page - 1) * perPage;

  const { subCategories, total } = await SubCategoryService.getAllFilteredSubCategories(
    filters,
    skip,
    perPage
  );

  return {
    data: subCategories,
    total,
    page,
    perPage,
  };
};

exports.getAllSubCategoriesByCategoryId = async ({
  categoryId,
  search,
  page,
  perPage,
  startDate,
  endDate,
}) => {
  const filters = {};

  filters.categoryId = categoryId;

  if (search) {
    filters.$or = [
      { name: { $regex: search, $options: 'i' } },
      { slug: { $regex: search, $options: 'i' } },
    ];
  }

  if (startDate || endDate) {
    filters.createdAt = {};
    if (startDate) filters.createdAt.$gte = new Date(startDate);
    if (endDate) filters.createdAt.$lte = new Date(endDate);
  }

  const skip = (page - 1) * perPage;

  const { subCategories, total } = await SubCategoryService.getAllFilteredSubCategoriesByCategoryId(
    filters,
    skip,
    perPage
  );

  return {
    data: subCategories,
    total,
    page,
    perPage,
  };
};

exports.updateSubCategory = async (id, data, image, userId) => {
  const subCategory = await SubCategoryService.getSingleSubCategory(id);
  if (!subCategory) {
    return {
      statusCode: 404,
      message: 'SubCategory not found',
      data: null,
    };
  }
  const subCategoryData = {
    ...data,
  };

  if (userId) {
    subCategoryData.updatedBy = userId;
  }

  let imageUrl = null;
  if (image) {
    imageUrl = await uploadSingleFile(image.path);
    subCategoryData.image = imageUrl;
  }

  const updatedSubCategory = await SubCategoryService.updateSubCategory(id, subCategoryData);

  return {
    statusCode: 200,
    message: 'SubCategory updated successfully',
    data: updatedSubCategory,
  };
};
