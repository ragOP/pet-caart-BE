const {
  createCollection,
  getAllFilteredCollections,
  getAllFilteredCollectionsBySubCategoryId,
  getSingleCollection,
  updateCollection,
} = require('../../repositories/collection/index');
const { uploadSingleFile } = require('../../utils/upload/index');

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

exports.getSingleCollection = async (id) => {
  const collection = await getSingleCollection(id);
  if (!collection) {
    return {
      status: 404,
      message: 'Collection not found',
      data: null,
      success: false,
    };
  }
  return {
    status: 200,
    message: 'Collection fetched successfully',
    data: collection,
    success: true,
  };
};

exports.updateCollection = async (id, data, image, userId) => {
  const collection = await getSingleCollection(id);
  if (!collection) {
    return {
      status: 404,
      message: 'Collection not found',
      data: null,
      success: false,
    };
  };
  const collectionPayload = {
    ...data,
    updatedBy: userId,
  };
  if (image) {
    const imageUrl = await uploadSingleFile(image.path);
    collectionPayload.image = imageUrl;
  }
  const updatedCollection = await updateCollection(id, collectionPayload);
  if (!updatedCollection) {
    return {
      status: 400,
      message: 'Failed to update collection',
      data: null,
      success: false,
    };
  }
  return {
    status: 200,
    message: 'Collection updated successfully',
    data: updatedCollection,
    success: true,
  };
};
