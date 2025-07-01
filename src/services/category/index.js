const {
  createCategory: createCategoryRepo,
  getAllCategories,
  getCategoryById,
  updateCategory: updateCategoryRepo,
} = require('../../repositories/category/index');
const { uploadSingleFile } = require('../../utils/upload');

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
    newCategory,
  };
};

const getCategories = async (search, page, limit, start_date, end_date) => {
  const { categories, total, totalPages } = await getAllCategories(
    search,
    page,
    limit,
    start_date,
    end_date
  );
  if (!categories) {
    return {
      statusCode: 404,
      message: 'No categories found',
      data: null,
    };
  }
  return {
    statusCode: 200,
    message: 'Categories fetched successfully',
    data: {
      categories,
      total,
      totalPages,
    },
  };
};

const getSingleCategory = async id => {
  const category = await getCategoryById(id);
  return {
    category,
  };
};

const updateCategory = async (id, data, image, userId) => {
  if (!id) {
    return {
      statusCode: 400,
      message: 'Category id is required',
      data: null,
    };
  }
  if (!userId) {
    return {
      statusCode: 400,
      message: 'User id is required',
      data: null,
    };
  }
  const categoryData = {
    ...data,
    updatedBy: userId,
  };

  let imageUrl = null;

  if (image) {
    imageUrl = await uploadSingleFile(image.path);
    categoryData.image = imageUrl;
  }

  const category = await updateCategoryRepo(id, categoryData);
  if (!category) {
    return {
      statusCode: 404,
      message: 'Category not found',
      data: null,
    };
  }
  return {
    statusCode: 200,
    message: 'Category updated successfully',
    data: category,
  };
};

module.exports = {
  createCategory,
  getCategories,
  getSingleCategory,
  updateCategory,
};
