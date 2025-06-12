const { createBreed, getSingleBreed, getAllBreeds } = require('../../services/breed/index.js');
const { asyncHandler } = require('../../utils/asyncHandler/index');
const ApiResponse = require('../../utils/apiResponse/index');
const { uploadSingleFile } = require('../../utils/upload/index');

exports.handleCreateBreed = asyncHandler(async (req, res) => {
    const { name, slug, species, description } = req.body;
    if (!name || !slug || !species) {
        return res.status(400).json(new ApiResponse(400, null, 'Name, species and slug fields are required'));
    };

    const image = req.files;
    if (!image) {
        return res.json(new ApiResponse(404, null, 'No Image Found', false));
    }

    const imageUrl = await uploadSingleFile(image[0].path);

    const result = await createBreed({ name, slug, species, description, image: imageUrl });
    return res.status(201).json(new ApiResponse(201, result, 'Breed created successfully', true));
});

exports.handleGetAllBreeds = asyncHandler(async (req, res) => {
    const { search, page = 1, per_page = 50, start_date, end_date } = req.query;
    const result = await getAllBreeds({ search, page, perPage: per_page, startDate: start_date, endDate: end_date });
    return res.status(200).json(new ApiResponse(200, result, 'Breeds fetched successfully', true));
});

exports.handleGetSingleBreed = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json(new ApiResponse(400, null, 'Breed id is required'));
    }
    const result = await getSingleBreed(id);
    return res.status(200).json(new ApiResponse(200, result, 'Breed fetched successfully', true));
});