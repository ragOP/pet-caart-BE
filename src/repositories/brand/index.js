const Brand = require('../../models/brandModel');

exports.createBrand = async brand => {
    const newBrand = await Brand.create(brand);
    return newBrand;
};

exports.getSingleBrand = async id => {
    const brand = await Brand.findById(id);
    return brand;
}

exports.getAllBrands = async (filters, skip = 0, limit = 50) => {
    const [brands, total] = await Promise.all([
        Brand.find(filters).sort({ createdAt: -1 }).skip(skip).limit(limit),
        Brand.countDocuments(filters),
    ])

    return { brands, total };
}