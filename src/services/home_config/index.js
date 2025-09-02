const { contentTypeMapping } = require('../../constants/content_mapping');
const { create, getAll, get, remove, update } = require('../../repositories/home_config');

exports.CreateNewHomeSection = async (
  title,
  contentType,
  contentItems,
  grid,
  isActive,
  position,
  backgroundImage,
  bannerImage
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

exports.GetAllGridConfig = async () => {
  const response = await getAll();
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
  bannerImage
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
