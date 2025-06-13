const { createBrand, getSingleBrand, getAllBrands } = require('../../repositories/brand/index.js');

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

  const { brands, total } = await getAllBrands(filters, skip, perPage);

  return {
    data: brands,
    total,
    page,
    perPage,
  };
  return brands;
};
