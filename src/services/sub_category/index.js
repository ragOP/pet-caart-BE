const SubCategoryService = require('../../repositories/sub_category/index');

exports.createSubCategory = async (subCategory) => {
    const newSubCategory = await SubCategoryService.createSubCategory(subCategory);
    return newSubCategory;
};

exports.getSingleSubCategory = async (id) => {
    const subCategory = await SubCategoryService.getSingleSubCategory(id);
    return subCategory;
};

exports.getAllSubCategories = async ({
  search,
  categoryId,
  page = 1,
  perPage = 50,
  startDate,
  endDate,
}) => {
  const filters = {};

  filters.categoryId = categoryId;

  // Optional search filter
  if (search) {
    filters.$or = [
      { name: { $regex: search, $options: 'i' } },
      { slug: { $regex: search, $options: 'i' } },
    ];
  }

  // Optional date filters
  if (startDate || endDate) {
    filters.createdAt = {};
    if (startDate) filters.createdAt.$gte = new Date(startDate);
    if (endDate) filters.createdAt.$lte = new Date(endDate);
  }

  const skip = (page - 1) * perPage;

  const { subCategories, total } = await SubCategoryService.getFilteredSubCategories(filters, skip, perPage);

  return {
    data: subCategories,
    total,
    page: Number(page),
    perPage: Number(perPage),
  };
};
