const Category = require('../../models/categoryModel');

exports.getAllCategories = async () => {
    const categories = Category.find().sort({ createdAt: -1 });
    return categories;
};

exports.getCategoryById = async (id) => {
    const category = await Category.findById(id);
    return category;
};

exports.createCategory = async (category) => {
    const newCategory = await Category.create(category);
    return newCategory;
};

