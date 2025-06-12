const {
  createCategory: createCategoryRepo,
  getAllCategories,
} = require('../../repositories/category/index');

const createCategory = async ({ name, slug, image, description, createdBy }) => {
  if (!name || !slug) {
    return {
      statusCode: 400,
      message: 'Name and slug are required',
      data: null,
    };
  }

  const newCategory = await createCategoryRepo({ name, slug, image, description, createdBy });
  return {
    newCategory
  };
};

const getCategories = async () => {
  const categories = await getAllCategories();
  return {
    categories
  };
};

module.exports = {
  createCategory,
  getCategories,
};