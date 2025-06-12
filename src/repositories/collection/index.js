const Collection = require('../../models/collectionModel');

exports.createCollection = async data => {
    const newCollection = await Collection.create(data);
    return newCollection;
};