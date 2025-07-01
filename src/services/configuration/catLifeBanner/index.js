const CatLifeBanner = require('../../../models/catLifeBanner');
const { uploadSingleFile } = require('../../../utils/upload');

exports.createCatLifeBanner = async (title, link, image) => {
  if (!title || !link || !image) {
    return {
      success: false,
      message: 'Title, link and image are required',
      data: null,
    };
  }
  const imageUrl = await uploadSingleFile(image);
  const catLifeBanner = await CatLifeBanner.createIfUnderLimit({ title, link, image: imageUrl });
  if (!catLifeBanner) {
    return {
      success: false,
      message: 'Cat life banner not created',
      data: null,
    };
  }
  return {
    success: true,
    message: 'Cat life banner created successfully',
    data: catLifeBanner,
  };
};

exports.getCatLifeBanners = async () => {
  const result = await CatLifeBanner.find({
    isActive: true,
  });
  if (!result) {
    return {
      success: false,
      message: 'Cat life banners not found',
      data: null,
    };
  }
  return {
    success: true,
    message: 'Cat life banners fetched successfully',
    data: result,
  };
};

exports.updateCatLifeBanner = async (id, title, link, image) => {
  if (!id) {
    return {
      success: false,
      message: 'Id is required',
      data: null,
    };
  }
  const catLifeBanner = await CatLifeBanner.findById(id);
  if (!catLifeBanner) {
    return {
      success: false,
      message: 'Cat life banner not found',
      data: null,
    };
  }
  if (image) {
    const imageUrl = await uploadSingleFile(image);
    image = imageUrl;
  }

  const payload = {
    title: title || catLifeBanner.title,
    link: link || catLifeBanner.link,
  };
  if (image) {
    payload.image = image || catLifeBanner.image;
  }
  const catLifeBannerUpdated = await CatLifeBanner.findByIdAndUpdate(id, payload, { new: true });
  if (!catLifeBannerUpdated) {
    return {
      success: false,
      message: 'Cat life banner not updated',
      data: null,
    };
  }
  return {
    success: true,
    message: 'Cat life banner updated successfully',
    data: catLifeBannerUpdated,
  };
};

exports.getCatLifeBannerById = async id => {
  const catLifeBanner = await CatLifeBanner.findById(id);
  if (!catLifeBanner) {
    return {
      success: false,
      message: 'Cat life banner not found',
      data: null,
    };
  }
  return {
    success: true,
    message: 'Cat life banner fetched successfully',
    data: catLifeBanner,
  };
};
