const {
  createBreed,
  getSingleBreed,
  getAllBreeds,
  updateBreed,
} = require('../../repositories/breed/index.js');
const { uploadSingleFile } = require('../../utils/upload/index');

exports.createBreed = async breed => {
  const newBreed = await createBreed(breed);
  return newBreed;
};

exports.getSingleBreed = async id => {
  const breed = await getSingleBreed(id);
  return breed;
};

exports.getAllBreeds = async ({ search, page, perPage, startDate, endDate }) => {
  let filters = {};

  if (search) {
    filters.$or = [
      { name: { $regex: search, $options: 'i' } },
      { species: { $regex: search, $options: 'i' } },
    ];
  }

  if (startDate || endDate) {
    filters.createdAt = {};
    if (startDate) filters.createdAt.$gte = new Date(startDate);
    if (endDate) filters.createdAt.$lte = new Date(endDate);
  }

  const skip = (page - 1) * perPage;

  const { breeds, total } = await getAllBreeds(filters, skip, perPage);

  return {
    data: breeds,
    total,
    page,
    perPage,
  };
};

exports.updateBreedService = async (id, data, image, userId) => {
  const breed = await getSingleBreed(id);
  if (!breed) {
    return {
      status: 404,
      message: 'Breed not found',
      data: null,
      success: false,
    };
  }
  const breedData = {
    ...data,
    updatedBy: userId,
  };

  if (image) {
    const imageUrl = await uploadSingleFile(image.path);
    breedData.image = imageUrl;
  }
  const updatedBreed = await updateBreed(id, breedData);
  if (!updatedBreed) {
    return {
      status: 400,
      message: 'Breed not updated',
      data: null,
      success: false,
    };
  }
  return {
    status: 200,
    message: 'Breed updated successfully',
    data: updatedBreed,
    success: true,
  };
};
