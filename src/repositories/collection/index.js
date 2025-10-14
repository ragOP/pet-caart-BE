const Collection = require('../../models/collectionModel');

exports.createCollection = async data => {
   const newCollection = await Collection.create(data);
   return newCollection;
};

exports.getAllFilteredCollections = async (filters, skip = 0, limit = 50) => {
   const [collections, total] = await Promise.all([
      Collection.find(filters)
         .sort({ createdAt: -1 })
         .skip(skip)
         .limit(limit)
         .populate('createdBy', 'name')
         .populate('updatedBy', 'name'),
      Collection.countDocuments(filters),
   ]);

   return { collections, total };
};

exports.getAllFilteredCollectionsBySubCategoryId = async (filters, skip = 0, limit = 50) => {
   const [collections, total] = await Promise.all([
      Collection.find(filters)
         .populate({
            path: 'subCategoryId',
            select: 'name slug',
         })
         .sort({ createdAt: -1 })
         .skip(skip)
         .limit(limit),
      Collection.countDocuments(filters),
   ]);

   return { collections, total };
};

exports.getSingleCollection = async id => {
   const collection = await Collection.findById(id)
      .populate('createdBy', 'name')
      .populate('updatedBy', 'name');
   return collection;
};

exports.updateCollection = async (id, data) => {
   const updatedCollection = await Collection.findByIdAndUpdate(id, data, { new: true });
   return updatedCollection;
};

exports.deleteCollection = async id => {
   const deletedCollection = await Collection.findByIdAndDelete(id);
   return deletedCollection;
};
