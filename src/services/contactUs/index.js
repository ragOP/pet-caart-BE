const ContactUs = require('../../models/contactUsModel');

exports.createContactUs = async (name, email, message) => {
   const contactUs = await ContactUs.create({ name, email, message });
   if (!contactUs) {
      return {
         statusCode: 400,
         success: false,
         message: 'Failed to create contact us message',
         data: null,
      };
   }
   return {
      statusCode: 200,
      success: true,
      message: 'Contact us message created successfully',
      data: contactUs,
   };
};

exports.getAllContactUs = async () => {
   const contactUs = await ContactUs.find().sort({ createdAt: -1 });
   if (!contactUs) {
      return {
         statusCode: 400,
         success: false,
         message: 'Failed to get all contact us messages',
         data: null,
      };
   }
   return {
      statusCode: 200,
      success: true,
      message: 'Contact us messages retrieved successfully',
      data: contactUs,
   };
};

exports.updateContactUs = async (id, data) => {
   const userQuery = await ContactUs.findById(id);
   if (!userQuery) {
      return {
         statusCode: 400,
         success: false,
         message: 'Contact us message not found',
         data: null,
      };
   }
   if (data.responded === true) {
      userQuery.responded = data.responded;
      if (data.responseMessage) {
         userQuery.responseMessage = data.responseMessage;
      }
      userQuery.respondedAt = new Date();
   }
   await userQuery.save();
   if (!userQuery) {
      return {
         statusCode: 400,
         success: false,
         message: 'Failed to update contact us message',
         data: null,
      };
   }
   return {
      statusCode: 200,
      success: true,
      message: 'Contact us message updated successfully',
      data: userQuery,
   };
};
