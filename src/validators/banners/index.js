const { body } = require('express-validator');

exports.validateCreateBanner = [
  body('type')
    .notEmpty()
    .withMessage('Type is required')
    .isIn(['web', 'app', 'mobile', 'tablet'])
    .withMessage('Invalid type'),
  body('image').notEmpty().withMessage('Image is required'),
];
