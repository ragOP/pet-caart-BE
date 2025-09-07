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

exports.getAll = async keyword => {
  const payload = {};
  if (keyword && keyword.length > 0) {
    payload.keyword = { $regex: keyword, $options: 'i' };
  }
  const response = await homeSectionModel.find(payload).populate('contentItems.itemId');
  return response;
};

exports.get = async id => {
  const response = await homeSectionModel.findById(id).populate('contentItems.itemId');
  return response;
};

exports.update_many = async (id, filter, update, newPosition) => {
  const response = await homeSectionModel.updateMany(filter, update);
  if (id) {
    await homeSectionModel.findByIdAndUpdate(id, { position: newPosition }, { new: true });
  }
  return response;
};
