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
  position,
  backgroundImage,
  bannerImage,
  mobileGrid,
  keyword
) => {
  const payload = {};
  if (title.length > 0) payload.title = title;
  if (contentType) payload.contentType = contentType;
  if (contentItems.length > 0) payload.contentItems = contentItems;
  if (grid) payload.grid = grid;
  if (isActive) payload.isActive = isActive;
  if (position) payload.position = position;
  if (backgroundImage.length > 0) payload.backgroundImage = backgroundImage;
  if (bannerImage.length > 0) payload.bannerImage = bannerImage;
  if (mobileGrid) payload.mobileGrid = mobileGrid;
  if (keyword.length > 0) payload.keyword = keyword;

  // Creating Mapping for Content Type Reference
  let contentTypeRef = contentTypeMapping[contentType];

  if (contentTypeRef) payload.contentTypeRef = contentTypeRef;

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
  const response = await remove(id);
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
  position,
  backgroundImage,
  bannerImage,
  mobileGrid,
  keyword
) => {
  const payload = {};
  if (title.length > 0) payload.title = title;
  if (contentType) payload.contentType = contentType;
  if (contentItems.length > 0) payload.contentItems = contentItems;
  if (grid) payload.grid = grid;
  if (isActive) payload.isActive = isActive;
  if (position) payload.position = position;
  if (backgroundImage) payload.backgroundImage = backgroundImage;
  if (bannerImage) payload.bannerImage = bannerImage;
  if (mobileGrid) payload.mobileGrid = mobileGrid;
  if (keyword.length > 0) payload.keyword = keyword;

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

  if (newPosition > oldPosition) {
    filter.position = { $gt: oldPosition, $lte: newPosition };
    filter._id = { $ne: id };
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
