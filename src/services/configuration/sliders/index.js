const fs = require('fs');
const { imageSize } = require('image-size');
const { uploadSingleFile } = require('../../../utils/upload');
const sliderModel = require('../../../models/sliderModel');

exports.createSlider = async (image, link, isActive, type) => {
  if (!type) {
    return {
      success: false,
      message: 'Type is required',
      data: null,
    };
  }

  const resolutionMap = {
    web: { width: 450, height: 250 },
    app: { width: 350, height: 150 },
    mobile: { width: 350, height: 150 },
    tablet: { width: 320, height: 180 },
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
  const slider = await sliderModel.findOne({});

  if (slider) {
    slider.images.push({
      image: imageUrl,
      link,
      isActive,
      type,
    });
    await slider.save();
    return {
      success: true,
      message: 'Slider created successfully',
      data: slider,
    };
  }

  const newSlider = await sliderModel.create({
    images: [{ image: imageUrl, link, isActive, type }],
  });

  return {
    success: true,
    message: 'Slider created successfully', 
    data: newSlider,
  };
};

exports.getSlider = async (type) => {
  if (!type) {
    return {
      success: false,
      message: 'Type is required',
      data: null,
    };
  }
  const slider = await sliderModel.findOne({
    'images.type': type,
    'images.isActive': true,
  });
  if (!slider) {
    return {
      success: false,
      message: 'Slider not found',
      data: null,
    };
  }
  return {
    success: true,
    message: 'Slider fetched successfully',
    data: slider,
  };
};

exports.updateSlider = async (body, image, id) => {
  console.log(body, image, id);
  if (!body.type || !id) {
    return {
      success: false,
      message: 'Type and id are required',
      data: null,
    };
  }

  if (image) {
    const resolutionMap = {
      web: { width: 450, height: 250 },
      app: { width: 350, height: 150 },
      mobile: { width: 350, height: 150 },
      tablet: { width: 320, height: 180 },
    };

    const expected = resolutionMap[body.type];

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
  }

  const slider = await sliderModel.findOne({});
  if (!slider) {
    return {
      success: false,
      message: 'Slider not found',
      data: null,
    };
  }

  const updateSlider = slider.images.find(image => image.id === id);
  if (!updateSlider) {
    return {
      success: false,
      message: 'Slider not found',
      data: null,
    };
  }

  if (image) {
    const imageUrl = await uploadSingleFile(image.path);
    updateSlider.image = imageUrl;
  }

  if (body.link) {
    updateSlider.link = body.link;
  }

  if (body.isActive) {
    updateSlider.isActive = body.isActive;
  }

  await slider.save();
  return {
    success: true,
    message: 'Slider updated successfully',
    data: updateSlider,
  };
};
