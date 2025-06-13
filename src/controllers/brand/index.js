const { createBrand, getSingleBrand, getAllBrands } = require('../../services/brand/index.js');
const { asyncHandler } = require('../../utils/asyncHandler/index');
const ApiResponse = require('../../utils/apiResponse/index');
const { uploadSingleFile } = require('../../utils/upload/index');

exports.handleCreateBrand = asyncHandler(async (req, res) => {
    const { name, slug, description } = req.body;
    if (!name || !slug) {
        return res.status(400).json(new ApiResponse(400, null, 'Name and slug fields are required'));
    };

    const image = req.files;
    if (!image) {
        return res.json(new ApiResponse(404, null, 'No Image Found', false));
    }

    const imageUrl = await uploadSingleFile(image[0].path);

    const result = await createBrand({ name, slug, description, logo: imageUrl });
    return res.status(201).json(new ApiResponse(201, result, 'Brand created successfully', true));
});

exports.handleGetAllBrands = asyncHandler(async (req, res) => {
    const { search, page = 1, per_page = 50, start_date, end_date } = req.query;
    const result = await getAllBrands({ search, page, perPage: per_page, startDate: start_date, endDate: end_date });
    return res.status(200).json(new ApiResponse(200, result, 'Brands fetched successfully', true));
});

exports.handleGetSingleBrand = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json(new ApiResponse(400, null, 'Brand id is required'));
    }
    const result = await getSingleBrand(id);
    return res.status(200).json(new ApiResponse(200, result, 'Brand fetched successfully', true));
});