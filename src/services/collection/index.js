const { createCollection } = require('../../repositories/collection/index');

exports.createCollection = async data => {
    const newCollection = await createCollection(data);
    return newCollection;
};