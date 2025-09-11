const { add, update, getAll, getByPageKey } = require('../../repositories/page_config');

exports.CreateNewPageConfig = async (pageKey, sections) => {
   if (!pageKey || !sections || !Array.isArray(sections) || sections.length === 0) {
      return {
         success: false,
         successCode: 400,
         message: 'Invalid input data',
         data: null,
      };
   }
   const response = await add(pageKey, sections);
   if (!response) {
      return {
         success: false,
         successCode: 500,
         message: 'Failed to create page configuration',
         data: null,
      };
   }
   return {
      success: true,
      successCode: 201,
      message: 'Page configuration created successfully',
      data: response,
   };
};

exports.UpdatePageConfig = async (id, sections) => {
   if (!id || !sections || !Array.isArray(sections) || sections.length === 0) {
      return {
         success: false,
         successCode: 400,
         message: 'Invalid input data',
         data: null,
      };
   }
   const response = await update(id, sections);
   if (!response) {
      return {
         success: false,
         successCode: 500,
         message: 'Failed to update page configuration',
         data: null,
      };
   }
   return {
      success: true,
      successCode: 200,
      message: 'Page configuration updated successfully',
      data: response,
   };
};

exports.GetAllPageConfigs = async () => {
   const response = await getAll();
   if (!response) {
      return {
         success: false,
         successCode: 500,
         message: 'Failed to retrieve page configurations',
         data: null,
      };
   }
   return {
      success: true,
      successCode: 200,
      message: 'Page configurations retrieved successfully',
      data: response,
   };
};

exports.GetGridByKey = async pageKey => {
   if (!pageKey) {
      return {
         success: false,
         successCode: 400,
         message: 'Page key is required',
         data: null,
      };
   }
   const response = await getByPageKey(pageKey);
   if (!response) {
      return {
         success: false,
         successCode: 404,
         message: 'Page configuration not found',

         data: null,
      };
   }
   return {
      success: true,
      successCode: 200,
      message: 'Page configuration retrieved successfully',
      data: response,
   };
};
