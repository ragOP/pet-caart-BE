const addressModel = require('../../models/addressModel');

exports.addressService = async (user, body) => {
   const { firstName, lastName, address, city, state, zip, country, phone, type, state_code } =
      body;

   if (body.isDefault === true) {
      const checkExistingDefaultAddress = await addressModel.findOne({
         user: user._id,
         isDefault: true,
      });
      if (checkExistingDefaultAddress) {
         checkExistingDefaultAddress.isDefault = false;
         await checkExistingDefaultAddress.save();
      }
   }

   if (type === 'home' || type === 'office') {
      const checkExistingAddress = await addressModel.findOne({ user: user._id, type: type });
      if (checkExistingAddress) {
         return {
            success: false,
            message: `You already have an address of this type ${type}`,
            data: null,
            statusCode: 400,
         };
      }
   }

   const addressPayload = {
      user: user._id,
      firstName,
      lastName,
      address,
      city,
      state,
      zip,
      country,
      phone,
      type,
      state_code,
   };

   if (body.isDefault === true) {
      addressPayload.isDefault = true;
   }

   const newAddress = await addressModel.create(addressPayload);

   return {
      success: true,
      message: 'Address created successfully',
      data: newAddress,
      statusCode: 201,
   };
};

exports.updateAddressService = async (user, body, id) => {
   const { firstName, lastName, address, city, state, zip, country, phone, type, state_code } =
      body;

   const addressPayload = {
      firstName,
      lastName,
      address,
      city,
      state,
      zip,
      country,
      phone,
      type,
      state_code,
   };

   if (body.isDefault === true) {
      const checkExistingDefaultAddress = await addressModel.findOne({
         user: user._id,
         isDefault: true,
         _id: { $ne: id },
      });
      if (checkExistingDefaultAddress) {
         checkExistingDefaultAddress.isDefault = false;
         await checkExistingDefaultAddress.save();
      }
   }

   if (type === 'home' || type === 'office') {
      const checkExistingAddress = await addressModel.findOne({
         user: user._id,
         type: type,
         _id: { $ne: id },
      });
      if (checkExistingAddress) {
         return {
            success: false,
            message: `You already have an address of this type ${type}`,
            data: null,
            statusCode: 400,
         };
      }
   }

   if (body.isDefault === true) {
      addressPayload.isDefault = true;
   }

   const updatedAddress = await addressModel.findByIdAndUpdate(id, addressPayload, { new: true });

   return {
      success: true,
      message: 'Address updated successfully',
      data: updatedAddress,
      statusCode: 200,
   };
};

exports.deleteAddressService = async (user, id) => {
   const address = await addressModel.findOne({ user: user._id, _id: id });
   if (!address) {
      return {
         success: false,
         message: 'Address not found',
         data: null,
         statusCode: 404,
      };
   }
   if (address.isDefault) {
      const defaultAddress = await addressModel.findOne({
         user: user._id,
         isDefault: false,
         _id: { $ne: id },
      });
      if (defaultAddress) {
         defaultAddress.isDefault = true;
         await defaultAddress.save();
      }
   }
   const deletedAddress = await address.deleteOne();
   return {
      success: true,
      message: 'Address deleted successfully',
      data: null,
      statusCode: 200,
   };
};

exports.getAllSavedAddresses = async user => {
   const addresses = await addressModel.find({ user: user._id }).sort({ createdAt: -1 });
   if (!addresses) {
      return {
         success: false,
         message: 'No addresses found',
         data: null,
         statusCode: 404,
      };
   }
   return {
      success: true,
      message: 'All saved addresses retrieved successfully',
      data: addresses,
      statusCode: 200,
   };
};
