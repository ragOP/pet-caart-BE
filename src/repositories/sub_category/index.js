const SubCategory = require('../../models/subCategoryModel');

exports.createSubCategory = async (subCategory) => {
    const newSubCategory = await SubCategory.create(subCategory);
    return newSubCategory;
};

exports.getFilteredSubCategories = async (filters, skip = 0, limit = 50) => {
  const [subCategories, total] = await Promise.all([
    SubCategory.find(filters)
      .populate({
        path: 'categoryId',
        select: 'name slug',
      })
      .sort({ createdAt: -1 })
      .skip(Number(skip))
      .limit(Number(limit)),
    SubCategory.countDocuments(filters),
  ]);

  return { subCategories, total };
};


exports.getSingleSubCategory = async (id) => {
    const subCategory = SubCategory.findById(id);
    return subCategory;
};