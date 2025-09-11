const { body } = require('express-validator');

exports.validateCreateBreed = [
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
   body('species')
      .notEmpty()
      .withMessage('Species is required')
      .isLength({ min: 3, max: 50 })
      .withMessage('Species must be between 3 and 50 characters long'),
   body('description')
      .optional()
      .isLength({ min: 3, max: 500 })
      .withMessage('Description must be between 3 and 500 characters long'),
];
