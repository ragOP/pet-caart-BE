const { createBreed, getSingleBreed, getAllBreeds } = require('../../repositories/breed/index.js');

exports.createBreed = async breed => {
  const newBreed = await createBreed(breed);
  return newBreed;
};

exports.getSingleBreed = async id => {
  const breed = await getSingleBreed(id);
  return breed;
};

exports.getAllBreeds = async ({ search, page, perPage, startDate, endDate }) => {
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

  const { breeds, total } = await getAllBreeds(filters, skip, perPage);

  return {
    data: breeds,
    total,
    page,
    perPage,
  };
  return breeds;
};
