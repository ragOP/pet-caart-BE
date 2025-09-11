const { body } = require('express-validator');

exports.validateCreateCollection = [
   body('name')
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ min: 3, max: 50 })
      .withMessage('Name must be between 3 and 50 characters long'),
   body('slug')
      .notEmpty()
      .withMessage('Slug is required')
      .isLength({ min: 3, max: 50 })
      .withMessage('Slug must be between 3 and 50 characters long'),
   body('subCategoryId').notEmpty().withMessage('SubCategory id is required'),
   body('description')
      .optional()
      .isLength({ min: 3, max: 500 })
      .withMessage('Description must be between 3 and 500 characters long'),
   body('productIds')
      .optional()
      .isArray({ min: 1 })
      .withMessage('Product ids must be an array with at least one element'),
   body('productIds.*').isMongoId().withMessage('Product ids must be valid ObjectIds'),
];
