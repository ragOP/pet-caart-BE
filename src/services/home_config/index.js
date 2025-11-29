const { contentTypeMapping } = require('../../constants/content_mapping');
const {
   create,
   getAll,
   get,
   remove,
   update,
   update_many,
} = require('../../repositories/home_config');
const { getByPageKey, getByPageKeyWithoutPopulate } = require('../../repositories/page_config');

exports.CreateNewHomeSection = async (
   title,
   isTitleShow,
   contentType,
   contentItems,
   grid,
   isActive,
   backgroundImage,
   bannerImage,
   bannerImageMobile,
   keyword
) => {
   const payload = {};
   if (title) payload.title = title;
   if (contentType) payload.contentType = contentType;
   if (contentItems.length > 0) payload.contentItems = contentItems;
   if (grid) payload.grid = grid;
   if (backgroundImage) payload.backgroundImage = backgroundImage;
   if (bannerImage) payload.bannerImage = bannerImage;
   if (bannerImageMobile) payload.bannerImageMobile = bannerImageMobile;
   if (keyword) payload.keyword = keyword;
   payload.isActive = isActive;
   payload.isTitleShow = isTitleShow;

   // Creating Mapping for Content Type Reference
   let contentTypeRef = contentTypeMapping[contentType];

   if (contentTypeRef) payload.contentTypeRef = contentTypeRef;

   const checkNumberOfRecordsAvailable = await getAll({ keyword });
   payload.position = checkNumberOfRecordsAvailable.length;

   const response = await create(payload);
   if (!response) {
      return {
         statusCode: 500,
         data: null,
         message: 'Failed to create home section',
         success: false,
      };
   }
   // Add the new section to PageConfig
   const existingHomeSetting = await getByPageKey(keyword);
   if (existingHomeSetting) {
      const newSection = {
         id: response._id,
         type: 'grid',
         key: 'grid',
         label: response.title || `Grid Section ${existingHomeSetting.sections.length + 1}`,
         position: existingHomeSetting.sections.length + 1,
      };
      const updatedSections = [...existingHomeSetting.sections, newSection];
      existingHomeSetting.sections = updatedSections;
      await existingHomeSetting.save();
   }
   return {
      statusCode: 200,
      data: response,
      message: 'Home section created successfully',
      success: true,
   };
};

exports.GetAllGridConfig = async (keyword, isActive) => {
   const filter = {};
   if (keyword) filter.keyword = keyword;
   if (isActive) filter.isActive = isActive;

   const response = await getAll(filter);
   if (!response) {
      return {
         statusCode: 500,
         data: null,
         message: 'Failed to retrieve grid configuration',
         success: false,
      };
   }
   return {
      statusCode: 200,
      data: response,
      message: 'Grid configuration retrieved successfully',
      success: true,
   };
};

exports.GetOneGridConfig = async id => {
   const response = await get(id);
   if (!response) {
      return {
         statusCode: 500,
         data: null,
         message: 'Failed to retrieve grid configuration',
         success: false,
      };
   }
   return {
      statusCode: 200,
      data: response,
      message: 'Grid configuration retrieved successfully',
      success: true,
   };
};

exports.DeleteGridConfig = async id => {
   const responseCheck = await get(id);
   if (!responseCheck) {
      return {
         statusCode: 404,
         data: null,
         message: 'Grid configuration not found',
         success: false,
      };
   }
   // Store the position of the record to be deleted
   const positionToBeDeleted = responseCheck.position;
   // Get existing home setting to update sections later
   let existingHomeSetting = await getByPageKeyWithoutPopulate(responseCheck.keyword);
   // Find the position of the section to be deleted
   const pagePositionToBeDeleted = existingHomeSetting.sections.find(
      section => section?.id == id
   )?.position;

   // Delete the record
   const response = await remove(id);

   // Decrement positions of records with position greater than the deleted record's position
   const filter = {};
   filter.position = { $gt: positionToBeDeleted };
   filter._id = { $ne: id };
   await update_many(null, filter, { $inc: { position: -1 } });

   // Remove the section from PageConfig if it exists
   if (response && existingHomeSetting) {
      existingHomeSetting.sections = existingHomeSetting.sections.filter(
         section => section.id != id
      );
      // Save the updated sections first to get the correct length
      existingHomeSetting = await existingHomeSetting.save();

      // Update the remaining sections' positions
      const updatedSections = existingHomeSetting.sections.map(section => {
         if (section.position > pagePositionToBeDeleted) {
            return { ...section.toObject(), position: section.position - 1 };
         }
         return section;
      });

      existingHomeSetting.sections = updatedSections;
      await existingHomeSetting.save();
   }
   if (!response) {
      return {
         statusCode: 500,
         data: null,
         message: 'Failed to delete grid configuration',
         success: false,
      };
   }
   return {
      statusCode: 200,
      data: 'ok',
      message: 'Grid configuration deleted successfully',
      success: true,
   };
};

exports.UpdateGridConfig = async (
   id,
   title,
   isTitleShow,
   contentType,
   contentItems,
   grid,
   isActive,
   backgroundImage,
   bannerImage,
   bannerImageMobile,
   keyword
) => {
   const payload = {};
   if (contentType) payload.contentType = contentType;
   if (contentItems.length > 0) payload.contentItems = contentItems;
   if (grid) payload.grid = grid;
   if (keyword) payload.keyword = keyword;
   payload.isActive = isActive;
   payload.title = title;
   payload.backgroundImage = backgroundImage;
   payload.bannerImage = bannerImage;
   payload.bannerImageMobile = bannerImageMobile;
   payload.isTitleShow = isTitleShow;

   let contentTypeRef = contentTypeMapping[contentType];

   if (contentTypeRef) payload.contentTypeRef = contentTypeRef;

   const existingPageConfig = await getByPageKey(keyword);
   console.log('Existing Page Config:', existingPageConfig.sections);
   existingPageConfig.sections = existingPageConfig.sections.map(section => {
      if (section?.id?._id?.toString() === id) {
         console.log('Updating section label to:', title || section.label);
         console.log('Existing section label was:', section.label);
         console.log('Section before update:', section);
         return {
            ...section.toObject(),
            label: title || section.label,
         };
      }
      return section;
   });
   await existingPageConfig.save();


   const response = await update(id, payload);
   if (!response) {
      return {
         statusCode: 500,
         data: null,
         message: 'Failed to update grid configuration',
         success: false,
      };
   }
   return {
      statusCode: 200,
      data: response,
      message: 'Grid configuration updated successfully',
      success: true,
   };
};

exports.UpdateGridConfigPosition = async (id, newPosition, oldPosition) => {
   if (newPosition === oldPosition) {
      return {
         statusCode: 200,
         data: null,
         message: 'No position change detected',
         success: true,
      };
   }

   const filter = {};
   let response;

   const checkExisitngRecord = await get(id);
   if (!checkExisitngRecord) {
      return {
         statusCode: 404,
         data: null,
         message: 'Grid configuration not found',
         success: false,
      };
   }
   if (newPosition > oldPosition) {
      filter.position = { $gt: oldPosition, $lte: newPosition };
      filter._id = { $ne: id };
      filter.keyword = { $eq: checkExisitngRecord.keyword };
      response = await update_many(id, filter, { $inc: { position: -1 } }, newPosition);
   }

   if (newPosition < oldPosition) {
      filter.position = { $lt: oldPosition, $gte: newPosition };
      filter._id = { $ne: id };
      filter.keyword = { $eq: checkExisitngRecord.keyword };
      response = await update_many(id, filter, { $inc: { position: 1 } }, newPosition);
   }
   if (!response) {
      return {
         statusCode: 500,
         data: null,
         message: 'Failed to update grid configuration position',
         success: false,
      };
   }
   return {
      statusCode: 200,
      data: response,
      message: 'Grid configuration position updated successfully',
      success: true,
   };
};

exports.UpdateGridConfigStatus = async (id, isActive) => {
   const payload = { isActive };
   const checkExisitngRecord = await get(id);
   if (!checkExisitngRecord) {
      return {
         statusCode: 404,
         data: null,
         message: 'Grid configuration not found',
         success: false,
      };
   }
   const response = await update(id, payload);

   // Remove the section from PageConfig if it exists and is being deactivated
   const existingHomeSetting = await getByPageKey(checkExisitngRecord.keyword);
   if (isActive === false && response && existingHomeSetting) {
      existingHomeSetting.sections = existingHomeSetting.sections.filter(
         section => section.id !== null
      );
      await existingHomeSetting.save();
   } else if (isActive === true && response && existingHomeSetting) {
      const newSection = {
         id: response._id,
         type: 'grid',
         key: 'grid',
         label: response.title || `Grid Section ${existingHomeSetting.sections.length + 1}`,
         position: existingHomeSetting.sections.length + 1,
      };
      const updatedSections = [...existingHomeSetting.sections, newSection];
      existingHomeSetting.sections = updatedSections;
      await existingHomeSetting.save();
   }
   if (!response) {
      return {
         statusCode: 500,
         data: null,
         message: 'Failed to update grid configuration status',
         success: false,
      };
   }
   return {
      statusCode: 200,
      data: response,
      message: 'Grid configuration status updated successfully',
      success: true,
   };
};
