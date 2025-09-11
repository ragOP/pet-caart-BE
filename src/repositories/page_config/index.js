const pageConfig = require('../../models/pageConfig');

exports.add = async (pageKey, sections) => {
   const response = await pageConfig.create({ pageKey, sections });
   return response;
};

exports.update = async (id, sections) => {
   const response = await pageConfig.findByIdAndUpdate(id, { sections }, { new: true });
   return response;
};

exports.getById = async id => {
   const response = await pageConfig.findById(id);
   return response;
};

exports.getByPageKey = async pageKey => {
   const response = await pageConfig.findOne({ pageKey }).populate('sections.id');
   return response;
};

exports.getAll = async () => {
   const response = await pageConfig.find().populate('sections.id');
   return response;
};

exports.deleteById = async id => {
   const response = await pageConfig.findByIdAndDelete(id);
   return response;
};
