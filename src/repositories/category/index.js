const Category = require('../../models/categoryModel');

exports.getAllCategories = async (search, page, limit, start_date, end_date) => {
   const query = {};
   if (search) {
      query.name = { $regex: search, $options: 'i' };
   }
   if (start_date && end_date) {
      query.createdAt = { $gte: new Date(start_date), $lte: new Date(end_date) };
   }
   query.isVisible = true;
   const categories = await Category.find(query)
      .sort({ createdAt: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('createdBy', 'name')
      .populate('updatedBy', 'name');
   const total = await Category.countDocuments(query);
   const totalPages = Math.ceil(total / limit);
   return { categories, total, totalPages };
};

exports.getCategoryById = async id => {
   const category = await Category.findById(id);
   return category;
};

exports.createCategory = async category => {
   const newCategory = await Category.create(category);
   return newCategory;
};

exports.updateCategory = async (id, data) => {
   const category = await Category.findByIdAndUpdate(id, data, { new: true });
   return category;
};
