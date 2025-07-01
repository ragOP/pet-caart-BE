const SubCategory = require('../../models/subCategoryModel');

exports.createSubCategory = async subCategory => {
  const newSubCategory = await SubCategory.create(subCategory);
  return newSubCategory;
};

exports.getAllFilteredSubCategories = async (filters, skip = 0, limit = 50) => {
  const [subCategories, total] = await Promise.all([
    SubCategory.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'name')
      .populate('updatedBy', 'name'),
    SubCategory.countDocuments(filters),
  ]);

  return { subCategories, total };
};

exports.getAllFilteredSubCategoriesByCategoryId = async (filters, skip = 0, limit = 50) => {
  const [subCategories, total] = await Promise.all([
    SubCategory.find(filters)
      .populate({
        path: 'categoryId',
        select: 'name slug',
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'name')
      .populate('updatedBy', 'name'),
    SubCategory.countDocuments(filters),
  ]);

  return { subCategories, total };
};

exports.getSingleSubCategory = async id => {
  const subCategory = await SubCategory.findById(id)
    .populate('createdBy', 'name')
    .populate('updatedBy', 'name');
  return subCategory;
};

exports.updateSubCategory = async (id, data) => {
  const updatedSubCategory = await SubCategory.findByIdAndUpdate(id, data, { new: true });
  return updatedSubCategory;
};
