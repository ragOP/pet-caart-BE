const { createCollection, getAllCollections, getAllCollectionsBySubCategoryId } = require('../../services/collection/index');
const { asyncHandler } = require('../../utils/asyncHandler/index');
const ApiResponse = require('../../utils/apiResponse/index');
const { uploadSingleFile } = require('../../utils/upload/index');
const mongoose = require('mongoose');

exports.handleCreateCollection = asyncHandler(async (req, res) => {
    const { name, slug, subCategoryId, description } = req.body;
    if (!subCategoryId || !name || !slug) {
        return res.status(400).json(new ApiResponse(400, null, 'SubCategory id, name and slug fields are required'));
    };

    const image = req.files;
    if (!image) {
        return res.json(new ApiResponse(404, null, 'No Image Found', false));
    }

    const imageUrl = await uploadSingleFile(image[0].path);

    const result = await createCollection({ name, slug, subCategoryId, image: imageUrl, description });
    return res.status(201).json(new ApiResponse(201, result, 'Collection created successfully', true));
});

exports.handleGetAllCollections = asyncHandler(async (req, res) => {
    const { subCategoryId, search, page = 1, per_page = 50, start_date, end_date } = req.query;
    let result;
    if (subCategoryId && mongoose.Types.ObjectId.isValid(subCategoryId)) {
        result = await getAllCollectionsBySubCategoryId({ subCategoryId, search, page, perPage: per_page, startDate: start_date, endDate: end_date });
    } else {
        result = await getAllCollections({ search, page, perPage: per_page, startDate: start_date, endDate: end_date });
    }
    return res.status(200).json(new ApiResponse(200, result, 'Collections fetched successfully', true));
});