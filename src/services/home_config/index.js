const { contentTypeMapping } = require('../../constants/content_mapping');
const {
  create,
  getAll,
  get,
  remove,
  update,
  update_many,
} = require('../../repositories/home_config');

exports.CreateNewHomeSection = async (
  title,
  contentType,
  contentItems,
  grid,
  isActive,
  backgroundImage,
  bannerImage,
  keyword
) => {
  const payload = {};
  if (title) payload.title = title;
  if (contentType) payload.contentType = contentType;
  if (contentItems.length > 0) payload.contentItems = contentItems;
  if (grid) payload.grid = grid;
  if (isActive) payload.isActive = isActive;
  if (backgroundImage) payload.backgroundImage = backgroundImage;
  if (bannerImage) payload.bannerImage = bannerImage;
  if (keyword) payload.keyword = keyword;

  // Creating Mapping for Content Type Reference
  let contentTypeRef = contentTypeMapping[contentType];

  if (contentTypeRef) payload.contentTypeRef = contentTypeRef;

  const checkNumberOfRecordsAvailable = await getAll(keyword);
  payload.position = checkNumberOfRecordsAvailable.length + 1;

  const response = await create(payload);
  if (!response) {
    return {
      statusCode: 500,
      data: null,
      message: 'Failed to create home section',
      success: false,
    };
  }
  return {
    statusCode: 200,
    data: response,
    message: 'Home section created successfully',
    success: true,
  };
};

exports.GetAllGridConfig = async keyword => {
  const response = await getAll(keyword);
  if (!response) {
    return {
      statusCode: 500,
      data: null,
      message: 'Failed to retrieve grid configuration',
      success: false,
    };
  }
  return {
    statusCode: 200,
    data: response,
    message: 'Grid configuration retrieved successfully',
    success: true,
  };
};

exports.GetOneGridConfig = async id => {
  const response = await get(id);
  if (!response) {
    return {
      statusCode: 500,
      data: null,
      message: 'Failed to retrieve grid configuration',
      success: false,
    };
  }
  return {
    statusCode: 200,
    data: response,
    message: 'Grid configuration retrieved successfully',
    success: true,
  };
};

exports.DeleteGridConfig = async id => {
  const responseCheck = await get(id);
  if (!responseCheck) {
    return {
      statusCode: 404,
      data: null,
      message: 'Grid configuration not found',
      success: false,
    };
  }
  // Store the position of the record to be deleted
  const positionToBeDeleted = responseCheck.position;
  // Delete the record
  const response = await remove(id);

  // Decrement positions of records with position greater than the deleted record's position
  const filter = {};
  filter.position = { $gt: positionToBeDeleted };
  filter._id = { $ne: id };
  await update_many(null, filter, { $inc: { position: -1 } });
  if (!response) {
    return {
      statusCode: 500,
      data: null,
      message: 'Failed to delete grid configuration',
      success: false,
    };
  }
  return {
    statusCode: 200,
    data: response,
    message: 'Grid configuration deleted successfully',
    success: true,
  };
};

exports.UpdateGridConfig = async (
  id,
  title,
  contentType,
  contentItems,
  grid,
  isActive,
  backgroundImage,
  bannerImage,
  keyword
) => {
  const payload = {};
  if (title) payload.title = title;
  if (contentType) payload.contentType = contentType;
  if (contentItems.length > 0) payload.contentItems = contentItems;
  if (grid) payload.grid = grid;
  if (isActive) payload.isActive = isActive;
  if (backgroundImage) payload.backgroundImage = backgroundImage;
  if (bannerImage) payload.bannerImage = bannerImage;
  if (keyword) payload.keyword = keyword;

  let contentTypeRef = contentTypeMapping[contentType];

  if (contentTypeRef) payload.contentTypeRef = contentTypeRef;

  const response = await update(id, payload);
  if (!response) {
    return {
      statusCode: 500,
      data: null,
      message: 'Failed to update grid configuration',
      success: false,
    };
  }
  return {
    statusCode: 200,
    data: response,
    message: 'Grid configuration updated successfully',
    success: true,
  };
};

exports.UpdateGridConfigPosition = async (id, newPosition, oldPosition) => {
  if (newPosition === oldPosition) {
    return {
      statusCode: 200,
      data: null,
      message: 'No position change detected',
      success: true,
    };
  }

  const filter = {};
  let response;

  const checkExisitngRecord = await get(id);
  if (!checkExisitngRecord) {
    return {
      statusCode: 404,
      data: null,
      message: 'Grid configuration not found',
      success: false,
    };
  }

  if (newPosition > oldPosition) {
    filter.position = { $gt: oldPosition, $lte: newPosition };
    filter._id = { $ne: id };
    filter.keyword = { $eq: checkExisitngRecord.keyword };
    response = await update_many(id, filter, { $inc: { position: -1 } }, newPosition);
  }

  if (newPosition < oldPosition) {
    filter.position = { $lt: oldPosition, $gte: newPosition };
    filter._id = { $ne: id };
    response = await update_many(id, filter, { $inc: { position: 1 } }, newPosition);
  }
  if (!response) {
    return {
      statusCode: 500,
      data: null,
      message: 'Failed to update grid configuration position',
      success: false,
    };
  }
  return {
    statusCode: 200,
    data: response,
    message: 'Grid configuration position updated successfully',
    success: true,
  };
};
