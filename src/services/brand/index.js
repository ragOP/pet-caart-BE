const {
  createBrand,
  getSingleBrand,
  getAllBrands,
  updateBrand,
} = require('../../repositories/brand/index.js');
const { uploadSingleFile } = require('../../utils/upload');

exports.createBrand = async brand => {
  const newBrand = await createBrand(brand);
  return newBrand;
};

exports.getSingleBrand = async id => {
  const brand = await getSingleBrand(id);
  return brand;
};

exports.getAllBrands = async ({ search, page, perPage, startDate, endDate }) => {
  let filters = {};

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

  filters.active = true;

  const { brands, total } = await getAllBrands(filters, skip, perPage);

  return {
    data: brands,
    total,
    page,
    perPage,
  };
};

exports.updateBrand = async (id, data, image, userId) => {
  const brand = await getSingleBrand(id);
  if (!brand) {
    return {
      statusCode: 404,
      message: 'Brand not found',
      data: null,
    };
  }
  const brandData = {
    ...data,
    updatedBy: userId,
  };

  if (image) {
    const imageUrl = await uploadSingleFile(image.path);
    brandData.image = imageUrl;
  }

  const updatedBrand = await updateBrand(id, brandData);
  return {
    statusCode: 200,
    message: 'Brand updated successfully',
    data: updatedBrand,
  };
};
