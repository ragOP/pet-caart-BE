const ProductBanner = require('../../../models/productBannerModel');
const Product = require('../../../models/productModel');
const { uploadSingleFile } = require('../../../utils/upload');
const fs = require('fs');
const { imageSize } = require('image-size');

exports.createProductBanner = async (productId, image, type) => {
  if (!productId || !image || !type) {
    return {
      success: false,
      statusCode: 400,
      message: 'Product ID, image, and type are required',
      data: null,
    };
  }

  const product = await Product.findById(productId);
  if (!product) {
    return {
      success: false,
      statusCode: 404,
      message: 'Product not found',
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
      statusCode: 400,
      message: 'Invalid banner type',
      data: null,
    };
  }

  const buffer = fs.readFileSync(image);
  const { width, height } = imageSize(buffer);

  if (width !== expected.width || height !== expected.height) {
    return {
      success: false,
      statusCode: 400,
      message: `Invalid image resolution. Expected ${expected.width}x${expected.height}, but got ${width}x${height}`,
      data: null,
    };
  }

  const existingProductBanner = await ProductBanner.findOne({ type });
  if (existingProductBanner) {
    return {
      success: false,
      statusCode: 400,
      data: null,
      message: 'Product banner already exists',
    };
  }

  const imageUrl = await uploadSingleFile(image);
  const productBanner = await ProductBanner.create({ productId, image: imageUrl, type });
  return {
    statusCode: 201,
    success: true,
    data: productBanner,
    message: 'Product banner created successfully',
  };
};

exports.getProductBanner = async (type, isAdmin) => {
  if (!isAdmin) {
    const productBanner = await ProductBanner.findOne({ type }).populate('productId');
    if (!productBanner) {
      return {
        statusCode: 404,
        success: false,
        data: null,
        message: 'Product banner not found',
      };
    }
    return {
      statusCode: 200,
      success: true,
      data: productBanner,
      message: 'Product banner fetched successfully',
    };
  }
  const productBanner = await ProductBanner.findOne({ type, isActive: true }).populate('productId');
  if (!productBanner) {
    return {
      statusCode: 404,
      success: false,
      data: null,
      message: 'Product banner not found',
    };
  }
  return {
    statusCode: 200,
    success: true,
    data: productBanner,
    message: 'Product banner fetched successfully',
  };
};

exports.updateProductBanner = async (productId, image, type, isActive) => {
  if (!productId || !type) {
    return {
      statusCode: 400,
      success: false,
      data: null,
      message: 'Product ID and type are required',
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
      statusCode: 400,
      message: 'Invalid banner type',
      data: null,
    };
  }

  const buffer = fs.readFileSync(image);
  const { width, height } = imageSize(buffer);

  if (width !== expected.width || height !== expected.height) {
    return {
      success: false,
      statusCode: 400,
      message: `Invalid image resolution. Expected ${expected.width}x${expected.height}, but got ${width}x${height}`,
      data: null,
    };
  }
  const product = await Product.findById(productId);
  if (!product) {
    return {
      statusCode: 404,
      success: false,
      data: null,
      message: 'Product not found',
    };
  }
  const existingProductBanner = await ProductBanner.findOne({ type });
  if (!existingProductBanner) {
    return {
      statusCode: 404,
      success: false,
      data: null,
      message: 'Product banner not found',
    };
  }
  if (image) {
    const imageUrl = await uploadSingleFile(image);
    existingProductBanner.image = imageUrl;
  }
  existingProductBanner.productId = productId;
  existingProductBanner.type = type;
  if (isActive !== undefined) {
    existingProductBanner.isActive = isActive;
  }
  const productBanner = await existingProductBanner.save();
  return {
    statusCode: 200,
    success: true,
    data: productBanner,
    message: 'Product banner updated successfully',
  };
};
