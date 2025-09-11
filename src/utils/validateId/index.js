const mongoose = require('mongoose');

exports.validateId = (id, name) => {
   if (id && !mongoose.Types.ObjectId.isValid(id)) {
      return {
         statusCode: 400,
         data: null,
         success: false,
         message: `Invalid ${name} ID`,
      };
   }
};
