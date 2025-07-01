const { body } = require('express-validator');
const mongoose = require('mongoose');

exports.validateCreateProduct = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),

  body('slug')
    .notEmpty()
    .withMessage('Slug is required')
    .isSlug()
    .withMessage('Slug must be URL friendly'),

  body('description')
    .optional()
    .isLength({ min: 3, max: 1000 })
    .withMessage('Description must be between 3 and 1000 characters'),

  body('categoryId')
    .optional()
    .custom(value => mongoose.Types.ObjectId.isValid(value))
    .withMessage('Invalid categoryId'),

  body('subCategoryId')
    .optional()
    .custom(value => mongoose.Types.ObjectId.isValid(value))
    .withMessage('Invalid subCategoryId'),

  body('breedId')
    .optional()
    .isArray()
    .withMessage('breedId must be an array')
    .custom(arr => arr.every(id => mongoose.Types.ObjectId.isValid(id)))
    .withMessage('All breedIds must be valid ObjectIds'),

  body('brandId')
    .optional()
    .custom(value => mongoose.Types.ObjectId.isValid(value))
    .withMessage('Invalid brandId'),

  body('variants').optional().isArray().withMessage('Variants must be an array'),

  body('variants.*.sku').notEmpty().withMessage('SKU is required for each variant'),

  body('variants.*.price')
    .notEmpty()
    .withMessage('Price is required for each variant')
    .isNumeric()
    .withMessage('Price must be a number'),

  body('variants.*.salePrice').optional().isNumeric().withMessage('Sale price must be a number'),

  body('variants.*.stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),

  body('variants.*.barcode').optional().isString().withMessage('Barcode must be a string'),

  body('price').optional().isNumeric().withMessage('Price must be a number'),

  body('salePrice').optional().isNumeric().withMessage('Sale price must be a number'),

  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),

  body('isActive').optional().isBoolean().withMessage('isActive must be true or false'),

  body('tags').optional().isArray().withMessage('Tags must be an array of strings'),

  body('images').optional().isArray().withMessage('Images must be an array of strings'),

  body('attributes').optional().isObject().withMessage('Attributes must be an object'),

  body('ratings.average')
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage('Average rating must be between 0 and 5'),

  body('ratings.count')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Ratings count must be a non-negative integer'),
];
