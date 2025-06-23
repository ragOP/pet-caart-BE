const fs = require('fs');
const mongoose = require('mongoose');
const { imageSize } = require('image-size');
const bannerModel = require('../../../models/bannerModel');
const { uploadSingleFile } = require('../../../utils/upload');
const AdBannerModel = require('../../../models/AdBannerModel');

exports.createBanner = async (type, image) => {
  if (!type || !image || !image.path) {
    return {
      success: false,
      message: 'Type and image are required',
      data: null,
    };
  }

  const resolutionMap = {
    web: { width: 1448, height: 250 },
    app: { width: 343, height: 120 },
    mobile: { width: 343, height: 120 },
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

  const checkExistingBanner = await bannerModel.findOne({ type });
  if (checkExistingBanner) {
    return {
      success: false,
      message: 'Banner already exists',
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
    web: { width: 1448, height: 250 },
    app: { width: 343, height: 120 },
    mobile: { width: 343, height: 120 },
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

exports.createAdBanner = async (title, description, link, products) => {
  if (!title || !description || !link || !products) {
    return {
      success: false,
      message: 'Title, description, link and products are required',
      data: null,
    };
  }
  const productIds = products.map(product => {
    if (mongoose.Types.ObjectId.isValid(product)) {
      return product;
    }
  });

  if (productIds.length !== products.length) {
    return {
      success: false,
      message: 'Invalid product ids',
      data: null,
    };
  }

  if(productIds.length > 4) {
    return {
      success: false,
      message: 'You can only add up to 4 products',
      data: null,
    };
  }

  const adBanner = await AdBannerModel.findOne({});
  if (adBanner) {
    adBanner.title = title;
    adBanner.description = description;
    adBanner.link = link;
    adBanner.products = productIds;
    await adBanner.save();
    return {
      success: true,
      message: 'Ad banner updated successfully',
      data: adBanner,
    };
  }

  const newadBanner = await AdBannerModel.create({
    title,
    description,
    link,
    products: productIds,
  });
  if (!newadBanner) {
    return {
      success: false,
      message: 'Ad banner not created',
      data: null,
    };
  }
  return {
    success: true,
    message: 'Ad banner created successfully',
    data: newadBanner,
  };
};

exports.getAdBanner = async () => {
  const adBanner = await AdBannerModel.findOne({}).populate('products');
  return {
    success: true,
    message: 'Ad banner fetched successfully',
    data: adBanner,
  };
};
