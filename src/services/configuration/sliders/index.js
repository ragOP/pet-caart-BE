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
    app: { width: 144, height: 80 },
    mobile: { width: 144, height: 80 },
    tablet: { width: 324, height: 180 },
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

exports.getSlider = async type => {
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
  const filteredSlider = slider.images.filter(image => image.type === type && image.isActive);
  return {
    success: true,
    message: 'Slider fetched successfully',
    data: filteredSlider,
  };
};

exports.updateSlider = async (body, image, id) => {
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
      app: { width: 144, height: 80 },
      mobile: { width: 144, height: 80 },
      tablet: { width: 324, height: 180 },
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

  const updateSlider = slider.images.find(image => image._id.toString() === id);
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

exports.getSliderById = async id => {
  const slider = await sliderModel.findOne({
    'images._id': id,
  });
  if (!slider) {
    return {
      success: false,
      message: 'Slider not found',
      data: null,
    };
  }

  const specificImage = slider.images.find(image => image._id.toString() === id);
  if (!specificImage) {
    return {
      success: false,
      message: 'Slider image not found',
      data: null,
    };
  }

  return {
    success: true,
    message: 'Slider fetched successfully',
    data: specificImage,
  };
};

exports.deleteSlider = async id => {
  const slider = await sliderModel.findOne({
    'images._id': id,
  });
  if (!slider) {
    console.log('slider not found');
    return {
      success: false,
      message: 'Slider not found',
      data: null,
    };
  }

  slider.images = slider.images.filter(image => image._id.toString() !== id);
  await slider.save();
  return {
    success: true,
    message: 'Slider deleted successfully',
    data: slider,
  };
};

exports.getAllSlider = async type => {
  const slider = await sliderModel.findOne({
    'images.isActive': true,
    'images.type': type,
  });

  if (!slider) {
    return {
      success: false,
      message: 'Slider not found',
      data: null,
    };
  }

  const filteredSlider = slider.images.filter(image => image.type === type);
  return {
    success: true,
    message: 'Slider fetched successfully',
    data: filteredSlider,
  };
};
