const {
  createCollection,
  getAllFilteredCollections,
  getAllFilteredCollectionsBySubCategoryId,
} = require('../../repositories/collection/index');

exports.createCollection = async data => {
  const newCollection = await createCollection(data);
  return newCollection;
};

exports.getAllCollections = async ({ search, page, perPage, startDate, endDate }) => {
  const filters = {};

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

  const { collections, total } = await getAllFilteredCollections(filters, skip, perPage);

  return {
    data: collections,
    total,
    page,
    perPage,
  };
};

exports.getAllCollectionsBySubCategoryId = async ({
  subCategoryId,
  search,
  page,
  perPage,
  startDate,
  endDate,
}) => {
  const filters = {};

  filters.subCategoryId = subCategoryId;

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

  const { collections, total } = await getAllFilteredCollectionsBySubCategoryId(
    filters,
    skip,
    perPage
  );

  return {
    data: collections,
    total,
    page,
    perPage,
  };
};
