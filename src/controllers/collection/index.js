const { createCollection } = require('../../services/collection/index');
const { asyncHandler } = require('../../utils/asyncHandler/index');
const ApiResponse = require('../../utils/apiResponse/index');
const { uploadSingleFile } = require('../../utils/upload/index');

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