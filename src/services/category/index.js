const {
  createCategory: createCategoryRepo,
  getAllCategories,
  getCategoryById,
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

const getSingleCategory = async (id) => {
  const category = await getCategoryById(id);
  return {
    category
  };
};

module.exports = {
  createCategory,
  getCategories,
  getSingleCategory
};