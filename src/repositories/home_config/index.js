const homeSectionModel = require('../../models/homeSectionModel');

// Create, Update, Delete, Get All, Get By ID functions for homeSectionModel
exports.create = async payload => {
  const response = await homeSectionModel.create(payload);
  return response;
};

exports.update = async (id, payload) => {
  const response = await homeSectionModel.findByIdAndUpdate(id, payload, { new: true });
  return response;
};

exports.remove = async id => {
  const response = await homeSectionModel.findByIdAndDelete(id);
  return response;
};

exports.getAll = async () => {
  const response = await homeSectionModel.find().populate('contentItems.itemId');
  return response;
};

exports.get = async id => {
  const response = await homeSectionModel.findById(id).populate('contentItems.itemId');
  return response;
};
