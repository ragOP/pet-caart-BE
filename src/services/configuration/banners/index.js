const fs = require('fs');
const { imageSize } = require('image-size');
const bannerModel = require('../../../models/bannerModel');
const { uploadSingleFile } = require('../../../utils/upload');

exports.createBanner = async (type, image) => {
  if (!type || !image || !image.path) {
    return {
      success: false,
      message: 'Type and image are required',
      data: null,
    };
  }

  const resolutionMap = {
    web: { width: 1428, height: 520 },
    app: { width: 350, height: 250 },
    mobile: { width: 350, height: 250 },
    tablet: { width: 696, height: 200 },
  };

  const expected = resolutionMap[type];

  if (!expected) {
    return {
      success: false,
      message: 'Invalid banner type',
      data: null,
    };
  }

  const buffer = fs.readFileSync(image.path);
  const { width, height } = imageSize(buffer);

  if (width !== expected.width || height !== expected.height) {
    return {
      success: false,
      message: `Invalid image resolution. Expected ${expected.width}x${expected.height}, but got ${width}x${height}`,
      data: null,
    };
  }

  const imageUrl = await uploadSingleFile(image.path);

  const banner = await bannerModel.create({ type, image: imageUrl });

  return {
    success: true,
    message: 'Banner created successfully',
    data: banner,
  };
};

exports.getBanner = async type => {
  const banner = await bannerModel.find({ type });
  return {
    success: true,
    message: 'Banner fetched successfully',
    data: banner,
  };
};

exports.updateBanner = async (type, image, id) => {
  if (!type || !image || !image.path || !id) {
    return {
      success: false,
      message: 'Type, image and id are required',
      data: null,
    };
  }

  const resolutionMap = {
    web: { width: 1428, height: 520 },
    app: { width: 350, height: 250 },
    mobile: { width: 350, height: 250 },
    tablet: { width: 696, height: 200 },
  };

  const expected = resolutionMap[type];

  if (!expected) {
    return {
      success: false,
      message: 'Invalid banner type',
      data: null,
    };
  }

  const buffer = fs.readFileSync(image.path);
  const { width, height } = imageSize(buffer);

  if (width !== expected.width || height !== expected.height) {
    return {
      success: false,
      message: `Invalid image resolution. Expected ${expected.width}x${expected.height}, but got ${width}x${height}`,
      data: null,
    };
  }

  const imageUrl = await uploadSingleFile(image.path);
  const banner = await bannerModel.findOne({
    _id: id,
    type: type,
  });

  if (!banner) {
    return {
      success: false,
      message: 'Banner not found',
    };
  }

  banner.image = imageUrl;
  await banner.save();

  return {
    success: true,
    message: 'Banner updated successfully',
    data: banner,
  };
};
