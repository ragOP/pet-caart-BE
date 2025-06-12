const Category = require('../../models/categoryModel');

exports.getAllCategories = async () => {
    const categories = Category.find().sort({ createdAt: -1 });
    return categories;
};

exports.createCategory = async (category) => {
    const newCategory = await Category.create(category);
    return newCategory;
};

