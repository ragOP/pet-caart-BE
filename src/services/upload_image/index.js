const { uploadSingleFile } = require('../../utils/upload');

exports.uploadImage = async image => {
  let imageUrl = await uploadSingleFile(image);
  if (!imageUrl) {
    return {
      status: 500,
      data: null,
      message: 'Image upload failed',
      success: false,
    };
  }
  return {
    status: 200,
    data: imageUrl,
    message: 'Image uploaded successfully',
    success: true,
  };
};
